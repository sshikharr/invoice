const express = require("express");
const {
    createBusiness
} = require("../../controller/private"); // Adjust the path as needed
const { authMiddleware } = require("../../middleware"); // Adjust the path as needed

const router = express.Router();

// Protected Route to search vendors
router.post("/", authMiddleware, createBusiness);

module.exports = router;
