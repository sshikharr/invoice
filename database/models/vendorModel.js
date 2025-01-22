const mongoose = require("mongoose");
const { Schema } = mongoose;

const vendorSchema = new Schema(
  {
    businessId: {
      type: String, // Store the URL/path of the uploaded logo
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      required: [true, "Email is required"],
      type: String,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phoneNumber: {
      required: [true, "Phone number is required"],
      type: String,
      unique: true,
    },
    taxInformation: {
      gstin: String,
      pan: String,
    },
    billingAddress: {
      country: String,
      state: String,
      cityTown: String,
      postalCode: String,
      streetAddress: String,
    },
    shippingDetails: {
      name: String,
      country: String,
      state: String,
      cityTown: String,
      postalCode: String,
      streetAddress: String,
    },
    adress: {
      stree: String,
      state: String,
      city: String,
      postalCode: String,
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      branch: String,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
