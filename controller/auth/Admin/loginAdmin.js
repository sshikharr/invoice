const bcrypt = require("bcryptjs");
const Admin = require("../../../database/models/adminModel");
const generateAndSendToken = require("../../../utils/generateAndSendToken");

// Admin Login Controller
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists by email
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Check if the password matches
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate and send the JWT token
    const payload = { user };
    const secret = process.env.JWT_SECRET;
    //expire in 1 day
    const expiresIn = 24 * 60 * 60; // 1 day in seconds

    const tokenSent = generateAndSendToken(res, payload, secret, expiresIn);

    if (!tokenSent) {
      return res.status(500).json({ message: "Error generating token." });
    }

    // Respond with success message
    res.status(200).json({ message: "Login successful.", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = loginAdmin;
