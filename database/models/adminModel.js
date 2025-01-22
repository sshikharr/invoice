const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    invoices: [
      {
        type: Schema.Types.ObjectId, // Reference to the Invoice model
        ref: "Invoice",
      },
    ],
    vendors: [
      {
        type: Schema.Types.ObjectId, // Reference to the Vendor model
        ref: "Vendor",
      },
    ],
    email: {
      type: String,
      sparse: true, // allows null or undefined for Google and phone signups
    },
    password: {
      type: String,
      select: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true, // Allows null or undefined for non-phone signups
    },
    role: {
      type: String,
      enum: ["owner", "manager"]
    },
    isVerified: {
      type: Boolean,
      default: false, // For OTP and email verification
    },
    resetPasswordToken: {
      type: String, // Token for resetting the password
      select: true,
    },
    resetPasswordExpires: {
      type: Date, // Expiration time for the reset token
      select: false,
    }
  },
  { timestamps: true }
);

const admin = mongoose.model("Admin", adminSchema);

module.exports = admin;
