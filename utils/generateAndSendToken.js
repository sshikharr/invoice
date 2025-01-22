const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token and sends it as a cookie.
 *
 * @param {Object} res - The response object from the Express route handler.
 * @param {Object} payload - The data to be included in the JWT payload.
 * @param {String} secret - The secret key to sign the JWT.
 * @param {Number} expiresIn - The expiration time of the JWT in seconds.
 */
const generateAndSendToken = (res, payload, secret, expiresIn = 3600) => {
  try {
    // Generate JWT token
    const token = jwt.sign(payload, secret, { expiresIn });

    // Send token as a cookie
    res.cookie("invoice_token", token, {
      httpOnly: true, // Prevent access to cookies via JavaScript
      secure: process.env.NODE_ENV === "production" ? true : false, // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF
      maxAge: expiresIn * 1000, // Cookie expiration time in milliseconds
    });

    return true;
  } catch (error) {
    console.error("Error generating or sending token:", error);
    return false;
  }
};

module.exports = generateAndSendToken;
