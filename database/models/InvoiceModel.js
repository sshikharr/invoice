const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    adminId: {
      type: ObjectId,
      ref: "Admin", // Reference to the admin who created the invoice
      required: true,
    },
    createdBy:{
      type: Schema.Types.ObjectId,
      ref: "Admin"
    },
    vendorId: {
      type: ObjectId,
      ref: "Vendor", // Reference to the vendor
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    businessLogoUrl: {
      type: String,
    },
    billedBy: {
      businessName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    billedTo: {
      clientId: {
        type: ObjectId,
        ref: "Vendor",
        required: true,
      },
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        thumbnailUrl: {
          type: String,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        rate: {
          type: Number,
          required: true,
          default: 0,
        },
        amount: {
          type: Number,
          required: true,
        },
        hsn:{
          type: String,
          required: true,
        },
        unit: {
          type: String,
          enum : ['kg','litre','meter','unit']
        },
      },
    ],
    discount: {
      type: Number,
      default: 0,
    },
    additionalCharges: {
      type: Number,
      default: 0,
    },
    shippingCharges: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    signatureUrl: {
      type: String,
    },
    contactDetails: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    shippingDetails: {
      recipientName: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      country: {
        type: String,
      },
      phone: {
        type: String,
      },
      specialInstructions: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
