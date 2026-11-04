const Stripe = require("stripe");
const MoneyDonation = require("../models/MoneyDonation");
const MoneyRequest = require("../models/MoneyRequest");
const Notification = require("../models/Notification");
const { generateTaxReceipt } = require("../services/pdfService");
const { sendReceiptEmail } = require("../services/emailService");

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key || !/^sk_(test|live)_[A-Za-z0-9]+$/.test(key)) return null;
  return new Stripe(key);
};

const stripeConfigurationMessage = "Stripe is not configured. Replace STRIPE_SECRET_KEY in backend/.env with the real key from Stripe Dashboard (sk_test_... or sk_live_...), then restart the backend.";

// @desc    Create Stripe Checkout Session
// @route   POST /api/payment/create-checkout-session
// @access  Private (Donor)
exports.createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: stripeConfigurationMessage
      });
    }
    const { amount, moneyRequestId, purpose } = req.body;
    const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || `${req.protocol}://${req.get("host")}`;
    const donationAmount = Number(amount);
    if (!Number.isFinite(donationAmount) || donationAmount <= 0 || !moneyRequestId) {
      return res.status(400).json({ success: false, message: "A valid amount and fundraiser are required" });
    }
    const moneyRequest = await MoneyRequest.findById(moneyRequestId);
    const remaining = moneyRequest
      ? Number(moneyRequest.amountNeeded) - Number(moneyRequest.amountRaised)
      : 0;
    if (!moneyRequest || moneyRequest.status !== "approved" || donationAmount > remaining) {
      return res.status(400).json({ success: false, message: "Fundraiser is no longer available for this amount" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: {
              name: `Donation for: ${purpose}`,
            },
            unit_amount: Math.round(donationAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${clientUrl}/donor?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/donor?payment=cancel`,
      metadata: {
        donorId: req.user._id.toString(),
        moneyRequestId,
        amount: donationAmount
      }
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

exports.confirmCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: stripeConfigurationMessage
      });
    }
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ success: false, message: "Payment session is required" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment has not been completed" });
    }
    if (session.metadata?.donorId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Payment session does not belong to this donor" });
    }

    const existing = await MoneyDonation.findOne({ stripeSessionId: session.id });
    if (existing) return res.json({ success: true, data: existing });

    const moneyRequest = await MoneyRequest.findById(session.metadata.moneyRequestId);
    const amount = Number(session.metadata.amount);
    const remaining = moneyRequest
      ? Number(moneyRequest.amountNeeded) - Number(moneyRequest.amountRaised)
      : 0;
    if (!moneyRequest || moneyRequest.status !== "approved" || !Number.isFinite(amount) || amount <= 0 || amount > remaining) {
      return res.status(400).json({ success: false, message: "Fundraiser is no longer available for this payment" });
    }

    const donation = await MoneyDonation.create({
      donorId: req.user._id,
      moneyRequestId: moneyRequest._id,
      amount,
      donationMethod: "online",
      paymentStatus: "success",
      confirmedAt: new Date(),
      stripeSessionId: session.id
    });
    moneyRequest.amountRaised += amount;
    await moneyRequest.save();
    await Notification.create({
      recipientId: moneyRequest.ngoId,
      message: `${req.user.name || "A donor"} donated LKR ${amount.toLocaleString()} via Online Card for "${moneyRequest.purpose}"`,
      type: "money_donation_received",
      relatedId: donation._id
    });
    try {
      const receiptPath = await generateTaxReceipt(req.user.name || req.user.email || "Donor", {
        type: "money",
        amount,
        campaignName: moneyRequest.purpose
      });
      donation.receiptUrl = `${process.env.API_PUBLIC_URL || process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`}${receiptPath}`;
      await donation.save();
      if (req.user.email) {
        await sendReceiptEmail(req.user.email, req.user.name || "Donor", receiptPath);
      }
    } catch (receiptError) {
      console.error("Stripe receipt generation error:", receiptError);
    }

    return res.status(201).json({ success: true, data: donation });
  } catch (error) {
    console.error("Stripe payment confirmation error:", error);
    return res.status(500).json({ success: false, message: "Unable to confirm payment" });
  }
};

exports.createPaymentIntent = async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) return res.status(503).json({ success: false, message: stripeConfigurationMessage });
    const { amount, moneyRequestId, purpose } = req.body;
    const donationAmount = Number(amount);
    const moneyRequest = await MoneyRequest.findById(moneyRequestId);
    const remaining = moneyRequest ? Number(moneyRequest.amountNeeded) - Number(moneyRequest.amountRaised) : 0;
    if (!moneyRequest || moneyRequest.status !== "approved" || !Number.isFinite(donationAmount) || donationAmount <= 0 || donationAmount > remaining) {
      return res.status(400).json({ success: false, message: "Fundraiser is no longer available for this amount" });
    }
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(donationAmount * 100),
      currency: "lkr",
      automatic_payment_methods: { enabled: true },
      description: `MealBridge donation for ${purpose || moneyRequest.purpose}`,
      metadata: { donorId: req.user._id.toString(), moneyRequestId, amount: donationAmount }
    });
    return res.status(200).json({ clientSecret: intent.client_secret });
  } catch (error) {
    console.error("Stripe PaymentIntent Error:", error.message);
    return res.status(500).json({ success: false, message: error.message || "Unable to start secure payment" });
  }
};

exports.confirmPaymentIntent = async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) return res.status(503).json({ success: false, message: stripeConfigurationMessage });
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) return res.status(400).json({ success: false, message: "Payment intent is required" });
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") return res.status(400).json({ success: false, message: "Payment has not been completed" });
    if (intent.metadata?.donorId !== req.user._id.toString()) return res.status(403).json({ success: false, message: "Payment does not belong to this donor" });
    const existing = await MoneyDonation.findOne({ stripePaymentIntentId: intent.id });
    if (existing) return res.json({ success: true, data: existing });
    const moneyRequest = await MoneyRequest.findById(intent.metadata.moneyRequestId);
    const amount = Number(intent.metadata.amount);
    const remaining = moneyRequest ? Number(moneyRequest.amountNeeded) - Number(moneyRequest.amountRaised) : 0;
    if (!moneyRequest || moneyRequest.status !== "approved" || !Number.isFinite(amount) || amount <= 0 || amount > remaining) {
      return res.status(400).json({ success: false, message: "Fundraiser is no longer available for this payment" });
    }
    const donation = await MoneyDonation.create({
      donorId: req.user._id, moneyRequestId: moneyRequest._id, amount,
      donationMethod: "online", paymentStatus: "success", confirmedAt: new Date(),
      stripePaymentIntentId: intent.id
    });
    moneyRequest.amountRaised += amount;
    await moneyRequest.save();
    await Notification.create({
      recipientId: moneyRequest.ngoId,
      message: `${req.user.name || "A donor"} donated LKR ${amount.toLocaleString()} via Online Card for "${moneyRequest.purpose}"`,
      type: "money_donation_received", relatedId: donation._id
    });
    const receiptPath = await generateTaxReceipt(req.user.name || req.user.email || "Donor", { type: "money", amount, campaignName: moneyRequest.purpose });
    donation.receiptUrl = `${process.env.API_PUBLIC_URL || process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`}${receiptPath}`;
    await donation.save();
    if (req.user.email) await sendReceiptEmail(req.user.email, req.user.name || "Donor", receiptPath);
    return res.status(201).json({ success: true, data: donation });
  } catch (error) {
    console.error("Stripe PaymentIntent confirmation error:", error);
    return res.status(500).json({ success: false, message: "Unable to confirm payment" });
  }
};
