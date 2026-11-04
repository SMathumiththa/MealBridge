const express = require("express");
const router = express.Router();
const { 
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
} = require("../controllers/feedbackController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Create feedback (NGO users only)
router.post("/", protect, authorizeRoles("ngo"), createFeedback);

// Get all feedbacks (admin/public)
router.get("/", protect, getAllFeedbacks);

// Get feedbacks for a specific donor
router.get("/donor/:donorId", getFeedbacksByDonor);

// Get donor rating statistics
router.get("/donor/:donorId/stats", getDonorRatingStats);

router.get("/volunteer/:volunteerId", protect, getFeedbacksByVolunteer);

// Get feedbacks submitted by current NGO user
router.get("/my/submitted", protect, getFeedbacksSubmittedByNgo);

// Get feedbacks received by current NGO user (as donor)
router.get("/my/received", protect, getFeedbacksReceivedByNgo);

// Get pending feedbacks for current user
router.get("/my/pending", protect, getFeedbacksPending);

// Update feedback (NGO users only)
router.put("/:feedbackId", protect, authorizeRoles("ngo"), updateFeedback);

// Delete feedback (NGO users only)
router.delete("/:feedbackId", protect, authorizeRoles("ngo"), deleteFeedback);

module.exports = router;
