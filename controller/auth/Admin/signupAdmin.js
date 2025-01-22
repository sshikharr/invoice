const bcrypt = require("bcryptjs");
const Admin = require("../../../database/models/adminModel");

// Admin Signup Controller
const signupAdmin = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    // Check if the email or phoneNumber already exists
    const existingUser = await Admin.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new admin user
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      isAdmin: true, // Ensure the new user is an admin
    });

    // Save the user to the database
    await newAdmin.save();

    // Respond with success message
    res.status(201).json({
      message: "Admin account created successfully. Please log in.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = signupAdmin;
