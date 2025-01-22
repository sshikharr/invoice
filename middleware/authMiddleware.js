const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify the JWT token
const authMiddleware = (req, res, next) => {
  // Extract token from cookies
  const token = req.cookies.invoice_token;

  // Check if the token is not provided
  if (!token) {
    return res.status(401).send({ message: "Not Authenticated" });
  }

  // Verify the token with the secret key from environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      console.log(err);
      return res.status(403).send({ message: "Token is not Valid" });
    }

    // Attach the decoded payload (user info) to the request object
    req.adminId = payload.user._id;

    // Pass control to the next middleware or route handler
    next();
  });
};

module.exports = authMiddleware;
