const { Schema, model, Types } = require("mongoose");

const expensesSchema = new Schema(
  {
    businessId: {
      type: Types.ObjectId,
      ref: "Business", // Reference to the business entity
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category:{
        type: String,
        enum: ["Office", "Travel", "Food", "Miscellaneous"],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description:{
        type: String,
        required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"], // Possible statuses for the invoice
      default: "Pending",
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Bank Transfer", "Credit Card"],
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
    updatedBy: {
      type: Types.ObjectId,
      ref: "Admin", // Reference to the user who updated the record
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

const Expenses = model("Expenses", expensesSchema);

module.exports = Expenses;
