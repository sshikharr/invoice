const logoutAdmin = (req, res) => {
  try {
    // Clear the JWT token cookie
    res.clearCookie("invoice_token", {
      httpOnly: true, // Prevent access to cookies via JavaScript
      secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
      sameSite: "strict", // Prevent CSRF
    });

    // Respond with a success message
    res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = logoutAdmin;
