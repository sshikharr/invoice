const Expenses = require("../../../database/models/expensesModel"); 
const Admin = require("../../../database/models/adminModel");

const createUploadInvoice = async (req, res) => {
  try {
    const { businessId, amount, status, category, description, paymentMethod } = req.body;
    const ownerId = req.adminId; // Assuming adminId is attached to the request by auth middleware

    // Validate admin existence
    const owner = await Admin.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Create new expense
    const newExpense = new Expenses({
      businessId,
      amount,
      category,
      date: new Date(),
      status: status || "Pending",
      ownerId,
      createdBy: ownerId,
      description,
      paymentMethod
    });

    // Save to database
    await newExpense.save();

    // Send response
    res.status(201).json({
      message: "Expense uploaded successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Error uploading expense:", error);
    res.status(500).json({
      message: "Error uploading expense",
      error: error.message,
    });
  }
};

module.exports = createUploadInvoice;
