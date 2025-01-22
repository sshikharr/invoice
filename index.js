const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

require("dotenv").config();
global.__basedir = __dirname;

const PORT = process.env.PORT || 5000;

// Define allowed domains for CORS
const allowedDomains = [
  process.env.PROD_CLIENT_DOMAIN, // Production domain
  process.env.DEV_CLIENT_DOMAIN, // Development domain
  process.env.LOCAL_CLIENT_DOMAIN, // Local domain
].filter(Boolean); // Filter out undefined or null values

// CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedDomains.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

// Middleware to handle JSON and URL-encoded form data
app.use(express.json());
app.use(cookieParser());

// Import and use routes
const mongo = require("./config/dbConfig");
app.use("/", require("./routes"));

// Root route
app.get("/", (req, res) => {
  res.send("Invoice generator backend is live!");
});

// Start server
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

// Open database connection
mongo.open();
