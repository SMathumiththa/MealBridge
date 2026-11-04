const express = require("express");
const router = express.Router();
const User = require("../models/User");
const MoneyRequest = require("../models/MoneyRequest");

// fix-na dev route removed

const {
  createMoneyRequest,
  getMoneyRequests,
  updateStatus,
  deleteMoneyRequest
} = require("../controllers/moneyRequestController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

const uploadFields = upload.fields([
  { name: 'needStatement', maxCount: 1 },
  { name: 'registrationCertificate', maxCount: 1 },
  { name: 'bankDetails', maxCount: 1 },
  { name: 'usageReport', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);

router.post("/", protect, authorizeRoles("ngo", "admin"), uploadFields, createMoneyRequest);
router.get("/", protect, authorizeRoles("donor", "admin", "ngo"), getMoneyRequests);
router.put("/:id/status", protect, authorizeRoles("admin"), updateStatus);
router.delete("/:id", protect, authorizeRoles("admin"), deleteMoneyRequest);

module.exports = router;
