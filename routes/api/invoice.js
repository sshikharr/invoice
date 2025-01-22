const express = require("express");
const {
  createInvoice,
  deleteInvoice,
  updateInvoice,
  getInvoices,
  invoiceDashboard,
} = require("../../controller/private"); // Adjust the path as needed
const { authMiddleware } = require("../../middleware"); // Adjust the path as needed
const uploadMiddleware = require("../../middleware/uploadMiddleware");
const router = express.Router();

/**
 * Invoice Management
 */

// Protected Route to create an invoice (requires authentication)
router.post("/", authMiddleware, createInvoice);

// Protected Route to update an invoice (requires authentication)
router.put("/update/:invoiceId", authMiddleware, updateInvoice);

// Protected Route to delete an invoice (requires authentication)
router.delete("/:invoiceId", authMiddleware, deleteInvoice);

// Protected Route to get invoice details by ID (requires authentication)
router.get("/:invoiceId", authMiddleware, getInvoices);

router.get("/", authMiddleware, invoiceDashboard);

module.exports = router;
