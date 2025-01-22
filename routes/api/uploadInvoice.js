const express = require("express");
const {
    createUploadInvoice,
    getUploadInvoices,
    getUploadInvoiceById
} = require("../../controller/private"); // Adjust the path as needed
const { authMiddleware } = require("../../middleware"); // Adjust the path as needed
const uploadMiddleware = require("../../middleware/uploadMiddleware");

const router = express.Router();

// Protected Route to search vendors
router.post("/", authMiddleware, uploadMiddleware, createUploadInvoice);

router.get("/", authMiddleware, getUploadInvoices)

router.get("/:id", authMiddleware, getUploadInvoiceById)

module.exports = router;
