const express = require("express");
const router = express.Router();
const { createCheckoutSession, confirmCheckoutSession, createPaymentIntent, confirmPaymentIntent } = require("../controllers/paymentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/create-checkout-session", protect, authorizeRoles("donor"), createCheckoutSession);
router.post("/confirm-session", protect, authorizeRoles("donor"), confirmCheckoutSession);
router.post("/create-payment-intent", protect, authorizeRoles("donor"), createPaymentIntent);
router.post("/confirm-payment-intent", protect, authorizeRoles("donor"), confirmPaymentIntent);

module.exports = router;
