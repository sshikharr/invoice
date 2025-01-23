const cloudinary = require("cloudinary").v2;
const UploadInvoice = require("../../../database/models/uploadInvoiceModel");
const Admin = require("../../../database/models/adminModel");
const Vendor = require("../../../database/models/vendorModel");
const Expenses = require("../../../database/models/expensesModel");
const imageUploader = require("../../../utils/imageUploader");

const createUploadInvoice = async (req, res) => {
  try {
    const {
      businessId,
      vendorId,
      invoiceAmount,
      status,
      invoiceName,
      description,
    } = req.body;
    const ownerId = req.adminId; // Assuming adminId is attached to the request by auth middleware

    // Validate admin existence
    const owner = await Admin.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const fileUrl = await imageUploader(req.file.buffer);

    // Create new upload invoice
    const newInvoice = new UploadInvoice({
      businessId,
      vendorId,
      invoiceAmount,
      date: new Date(),
      file: fileUrl,
      status: status || "Pending",
      invoiceName,
      ownerId,
      createdBy: ownerId,
      description,
    });

    // Save to database
    await newInvoice.save();

    // Create new expense
    const newExpense = new Expenses({
      businessId,
      vendorId,
      amount: invoiceAmount,
      category: "Miscellaneous", // You can adjust the category as needed
      date: new Date(),
      status: status || "Pending",
      ownerId,
      createdBy: ownerId,
      description,
    });

    // Save the expense to the database
    await newExpense.save();

    // Send response
    res.status(201).json({
      message: "Invoice uploaded and expense recorded successfully",
      invoice: newInvoice,
      expense: newExpense,
    });
  } catch (error) {
    console.error("Error uploading invoice:", error);
    res.status(500).json({
      message: "Error uploading invoice",
      error: error.message,
    });
  }
};

module.exports = createUploadInvoice;
