const express = require("express");
const {
  createVendor,
  deleteVendor,
  getVendors,
  updateVendor,
  getVendorById,
} = require("../../controller/private"); // Adjust the path as needed
const { authMiddleware } = require("../../middleware"); // Adjust the path as needed

const router = express.Router();

// Protected Route to search vendors
router.get("/:vendorId", authMiddleware, getVendorById);
router.get("/", authMiddleware, getVendors);
router.post("/", authMiddleware, createVendor);
router.put("/:vendorId", authMiddleware, updateVendor);
router.delete("/:vendorId", authMiddleware, deleteVendor);

module.exports = router;
