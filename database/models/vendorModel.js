const mongoose = require("mongoose");
const { Schema } = mongoose;

const vendorSchema = new Schema(
  {
    logo: {
      type: String, // Store the URL/path of the uploaded logo
    },
    businessName: {
      type: String,
      required: [true, "Business name is required"],
    },
    vendorIndustry: {
      type: String,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    cityTown: {
      type: String,
    },
    vatNumber: {
      type: String,
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
    businessAlias: {
      type: String,
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
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    GSTIN:{
      type: String,
    },
    PAN:{
      type: String,
    },
    createdBy:{
      type: Schema.Types.ObjectId,
      ref: "Admin"
    },
    status: {
      type: String,
      enum: ["Active", "Not active", "Archieved"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
