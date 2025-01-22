const express = require("express");
const {
    createBusiness,
    updateBusiness,
    getBusiness,
    deleteBusiness
} = require("../../controller/private"); // Adjust the path as needed
const { authMiddleware } = require("../../middleware"); // Adjust the path as needed

const router = express.Router();

// Protected Route to search vendors
router.post("/", authMiddleware, createBusiness);
router.put("/:businessId", authMiddleware, updateBusiness);
router.get("/", authMiddleware, getBusiness);
router.delete("/:businessId", authMiddleware, deleteBusiness);

module.exports = router;
