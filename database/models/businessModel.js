const mongoose = require("mongoose");
const { Schema } = mongoose;

const businessSchema = new Schema(
  {
    contactInformation: {
      email: {
        type: String,
        required: [true, "Email is required"],
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please provide a valid email address",
        ],
      },
      mobile: {
        type: String,
        required: [true, "Mobile number is required"],
        match: [/^\d{10,15}$/, "Please provide a valid mobile number"],
      },
    },
    address: {
      streetAddress: String,
      pin: String,
      city: String,
      state: String,
      country: String,
    },
    legalName: {
      type: String,
      required: true,
    },
    tradeName: {
      type: String,
    },
    taxInformation: {
      gstin: String,
      pan: String,
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      branch: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Business = mongoose.model("Business", businessSchema);

module.exports = Business;
