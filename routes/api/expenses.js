const express = require("express");
const {
    createExpenses,
    getExpenses,
    getExpenseDashboardStats
} = require("../../controller/private"); // Adjust the path as needed
const { authMiddleware } = require("../../middleware"); // Adjust the path as needed

const router = express.Router();

// Protected Route to search vendors
router.post("/", authMiddleware, createExpenses);
router.get("/", authMiddleware, getExpenses);
router.get("/dashboard/stats", authMiddleware, getExpenseDashboardStats)

module.exports = router;
