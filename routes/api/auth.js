const express = require("express");
const {
  signupAdmin,
  loginAdmin,
  logoutAdmin,
} = require("../../controller/auth"); // Adjust the path as needed
const router = express.Router();

/**
 * Admin Management
 */
router.post("/signup", signupAdmin); // Admin signup
router.post("/login", loginAdmin); // Admin login
router.post("/logout", logoutAdmin); // Admin logout

module.exports = router;
