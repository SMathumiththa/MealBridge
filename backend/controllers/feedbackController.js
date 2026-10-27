const Feedback = require("../models/Feedback");
const User = require("../models/User");
const Request = require("../models/Request");
const Notification = require("../models/Notification");

// ✅ CREATE FEEDBACK (NGO submits rating after delivery)
const createFeedback = async (req, res) => {
  try {
    const { rating, comment, donorId, volunteerId, donationId, requestId } = req.body;
    const ngoId = req.user._id;

    // Validation
    if (!rating || (!donorId && !volunteerId) || !requestId || (donorId && volunteerId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Rating, Donor ID, and Request ID are required" 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: "Rating must be between 1 and 5" 
      });
    }

    // Check if request exists and is completed
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: "Request not found" 
      });
    }

    if (request.status !== "completed") {
      return res.status(400).json({ 
        success: false, 
        message: "Feedback can only be submitted for completed donations" 
      });
    }

    // Check if feedback already exists for this request
    if (req.user.role !== "ngo") {
      return res.status(403).json({ success: false, message: "Only NGOs can submit delivery feedback" });
    }

    if (request.ngoId.toString() !== ngoId.toString()) {
      return res.status(403).json({ success: false, message: "You can rate only your own deliveries" });
    }

    if (volunteerId && request.volunteerId?.toString() !== volunteerId.toString()) {
      return res.status(400).json({ success: false, message: "Volunteer is not assigned to this delivery" });
    }

    const existingFeedback = await Feedback.findOne({ requestId, ...(volunteerId ? { volunteerId } : { donorId }) });
    if (existingFeedback) {
      return res.status(400).json({ 
        success: false, 
        message: "Feedback already submitted for this donation" 
      });
    }

    // Create feedback
    const newFeedback = new Feedback({
      rating,
      comment: comment || "",
      donorId: donorId || undefined,
      volunteerId: volunteerId || undefined,
      ngoId,
      donationId: donationId || null,
      requestId,
      status: "completed"
    });

    await newFeedback.save();

    // Update request with feedback submitted flag
    await Request.findByIdAndUpdate(requestId, volunteerId ? { volunteerFeedbackSubmitted: true } : { feedbackSubmitted: true });

    // Update donor rating statistics
    if (donorId) await updateDonorRating(donorId);
    if (volunteerId) await updateVolunteerRating(volunteerId);

    // Notify Donor
    await Notification.create({
      recipientId: volunteerId || donorId,
      message: `${req.user.name || 'An NGO'} left a ${rating}-star feedback on your delivery.`,
      type: 'feedback_received',
      relatedId: newFeedback._id
    });
    const io = req.app.get("io");
    if (io) {
      io.to((volunteerId || donorId).toString()).emit("new_notification", {
        recipientId: volunteerId || donorId,
        message: `${req.user.name || 'An NGO'} left a ${rating}-star feedback on your delivery.`,
        type: 'feedback_received',
        relatedId: newFeedback._id
      });
    }

    res.status(201).json({ 
      success: true, 
      message: "Feedback submitted successfully", 
      data: newFeedback 
    });
  } catch (error) {
    console.error("Feedback creation error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

// ✅ GET ALL FEEDBACKS
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("donorId", "name email organization")
      .populate("ngoId", "name organization")
      .populate("volunteerId", "name organization")
      .populate("requestId", "status")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      data: feedbacks,
      count: feedbacks.length 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

// ✅ GET FEEDBACKS BY DONOR ID
const getFeedbacksByDonor = async (req, res) => {
  try {
    const { donorId } = req.params;

    const feedbacks = await Feedback.find({ donorId })
      .populate("ngoId", "name organization")
      .populate("requestId", "status")
      .sort({ createdAt: -1 });

    // Get donor info with rating
    const donor = await User.findById(donorId).select("name email organization averageRating totalFeedback");

    if (!donor) {
      return res.status(404).json({ 
        success: false, 
        message: "Donor not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      donor,
      feedbacks,
      count: feedbacks.length 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

const getFeedbacksByVolunteer = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ volunteerId: req.params.volunteerId })
      .populate("ngoId", "name organization")
      .populate("requestId", "status")
      .sort({ createdAt: -1 });
    const volunteer = await User.findById(req.params.volunteerId).select("name averageRating totalRatings totalFeedback");
    if (!volunteer) return res.status(404).json({ success: false, message: "Volunteer not found" });
    res.json({ success: true, volunteer, feedbacks, count: feedbacks.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✅ GET FEEDBACKS RECEIVED
const getFeedbacksReceivedByNgo = async (req, res) => {
  try {
    const userId = req.user._id;
    let feedbacks = [];

    if (req.user.role === 'ngo') {
      const MoneyRequest = require('../models/MoneyRequest');
      const MoneyDonation = require('../models/MoneyDonation');
      const myRequests = await MoneyRequest.find({ ngoId: userId }).select('_id');
      const requestIds = myRequests.map(r => r._id);
      
      const moneyDonations = await MoneyDonation.find({ 
        moneyRequestId: { $in: requestIds },
        'feedback.rating': { $exists: true }
      }).populate('donorId', 'name email').sort({ updatedAt: -1 });

      feedbacks = moneyDonations.map(md => ({
        _id: md._id,
        rating: md.feedback.rating,
        comment: md.feedback.comment,
        createdAt: md.updatedAt,
        donorId: md.donorId,
        isMoneyDonation: true
      }));
    } else if (req.user.role === 'donor') {
      feedbacks = await Feedback.find({ donorId: userId })
        .populate("ngoId", "name email organization")
        .populate("requestId", "status")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ 
      success: true, 
      data: feedbacks,
      count: feedbacks.length 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

// ✅ GET FEEDBACKS SUBMITTED
const getFeedbacksSubmittedByNgo = async (req, res) => {
  try {
    const userId = req.user._id;
    let feedbacks = [];

    if (req.user.role === 'ngo') {
      feedbacks = await Feedback.find({ ngoId: userId })
        .populate("donorId", "name email organization averageRating")
        .populate("volunteerId", "name email averageRating")
        .populate("requestId", "status")
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'donor') {
      const MoneyDonation = require('../models/MoneyDonation');
      const moneyDonations = await MoneyDonation.find({
        donorId: userId,
        'feedback.rating': { $exists: true }
      }).populate({
        path: 'moneyRequestId',
        select: 'purpose ngoId',
        populate: { path: 'ngoId', select: 'name' }
      }).sort({ updatedAt: -1 });

      feedbacks = moneyDonations.map(md => ({
        _id: md._id,
        rating: md.feedback.rating,
        comment: md.feedback.comment,
        createdAt: md.updatedAt,
        ngoId: md.moneyRequestId ? md.moneyRequestId.ngoId : null,
        isMoneyDonation: true
      }));
    }

    res.status(200).json({ 
      success: true, 
      data: feedbacks,
      count: feedbacks.length 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

// ✅ UPDATE FEEDBACK (Edit existing feedback)
const updateFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { rating, comment } = req.body;
    const ngoId = req.user._id;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ 
        success: false, 
        message: "Feedback not found" 
      });
    }

    // Only NGO who submitted can edit
    if (feedback.ngoId.toString() !== ngoId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to update this feedback" 
      });
    }

    // Update feedback
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ 
          success: false, 
          message: "Rating must be between 1 and 5" 
        });
      }
      feedback.rating = rating;
    }

    if (comment !== undefined) {
      feedback.comment = comment;
    }

    await feedback.save();

    if (feedback.donorId) await updateDonorRating(feedback.donorId);
    if (feedback.volunteerId) await updateVolunteerRating(feedback.volunteerId);

    res.status(200).json({ 
      success: true, 
      message: "Feedback updated successfully", 
      data: feedback 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

// ✅ DELETE FEEDBACK
const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const ngoId = req.user._id;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ 
        success: false, 
        message: "Feedback not found" 
      });
    }

    // Only NGO who submitted can delete
    if (feedback.ngoId.toString() !== ngoId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to delete this feedback" 
      });
    }

    const donorId = feedback.donorId;
    const volunteerId = feedback.volunteerId;
    await Feedback.deleteOne({ _id: feedbackId });

    if (donorId) await updateDonorRating(donorId);
    if (volunteerId) await updateVolunteerRating(volunteerId);

    res.status(200).json({ 
      success: true, 
      message: "Feedback deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

// ✅ GET DONOR RATING & STATISTICS
const getDonorRatingStats = async (req, res) => {
  try {
    const { donorId } = req.params;

    const donor = await User.findById(donorId).select("name email organization averageRating totalRatings totalFeedback");
    if (!donor) {
      return res.status(404).json({ 
        success: false, 
        message: "Donor not found" 
      });
    }

    const feedbacks = await Feedback.find({ donorId });
    const ratingDistribution = {
      5: feedbacks.filter(f => f.rating === 5).length,
      4: feedbacks.filter(f => f.rating === 4).length,
      3: feedbacks.filter(f => f.rating === 3).length,
      2: feedbacks.filter(f => f.rating === 2).length,
      1: feedbacks.filter(f => f.rating === 1).length,
    };

    res.status(200).json({ 
      success: true, 
      donor,
      ratingDistribution,
      totalReviews: feedbacks.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

// ✅ HELPER FUNCTION: Update Donor Rating
const updateDonorRating = async (donorId) => {
  try {
    const feedbacks = await Feedback.find({ donorId });
    
    if (feedbacks.length === 0) {
      await User.findByIdAndUpdate(donorId, {
        averageRating: 0,
        totalRatings: 0,
        totalFeedback: 0
      });
      return;
    }

    const totalRating = feedbacks.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = (totalRating / feedbacks.length).toFixed(1);

    await User.findByIdAndUpdate(donorId, {
      averageRating: parseFloat(averageRating),
      totalRatings: feedbacks.length,
      totalFeedback: feedbacks.length
    });
  } catch (error) {
    console.error("Error updating donor rating:", error);
  }
};

const updateVolunteerRating = async (volunteerId) => {
  const feedbacks = await Feedback.find({ volunteerId });
  const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
  await User.findByIdAndUpdate(volunteerId, {
    averageRating: feedbacks.length ? parseFloat((totalRating / feedbacks.length).toFixed(1)) : 0,
    totalRatings: feedbacks.length,
    totalFeedback: feedbacks.length
  });
};

// ✅ GET PENDING FEEDBACKS
const getFeedbacksPending = async (req, res) => {
  try {
    const userId = req.user._id;
    let pending = [];

    if (req.user.role === 'donor') {
      const MoneyDonation = require('../models/MoneyDonation');
      const moneyDonations = await MoneyDonation.find({
        donorId: userId,
        paymentStatus: 'success',
        'feedback.rating': { $exists: false }
      }).populate({
        path: 'moneyRequestId',
        select: 'purpose ngoId',
        populate: { path: 'ngoId', select: 'name' }
      }).sort({ updatedAt: -1 });

      pending = moneyDonations.map(md => ({
        _id: md._id,
        moneyRequestId: md.moneyRequestId,
        amount: md.amount,
        createdAt: md.createdAt,
        ngoId: md.moneyRequestId ? md.moneyRequestId.ngoId : null,
        isMoneyDonation: true
      }));
    }

    res.status(200).json({ 
      success: true, 
      data: pending,
      count: pending.length 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = { 
  createFeedback, 
  getAllFeedbacks,
  getFeedbacksByDonor,
  getFeedbacksByVolunteer,
  getFeedbacksReceivedByNgo,
  getFeedbacksSubmittedByNgo,
  getFeedbacksPending,
  updateFeedback,
  deleteFeedback,
  getDonorRatingStats
};
