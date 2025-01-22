const { Schema, model, Types } = require("mongoose");

const uploadInvoiceSchema = new Schema(
  {
    businessId: {
      type: Types.ObjectId,
      ref: "Business", // Reference to the business entity
      required: true,
    },
    vendorId: {
      type: Types.ObjectId,
      ref: "Vendor", // Reference to the vendor
      required: true,
    },
    invoiceAmount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    file: {
      type: String, // URL or file path of the uploaded invoice
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"], // Possible statuses for the invoice
      default: "Pending",
    },
    invoiceName: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Types.ObjectId,
      ref: "Admin", // Reference to the admin who owns the invoice
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "Admin", // Reference to the user who created the record
    },
    description: {
      type: String,
      required: true,
    }
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

const UploadInvoice = model("UploadInvoice", uploadInvoiceSchema);

module.exports = UploadInvoice;
