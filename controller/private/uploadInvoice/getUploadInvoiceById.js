const UploadInvoice = require("../../../database/models/uploadInvoiceModel");

const getUploadInvoiceById = async (req, res) => {
  const { id } = req.params; // Extract the invoice ID from the request parameters

  try {
    // Find the invoice by ID and populate business and vendor details
    const invoice = await UploadInvoice.findById(id)

    // Check if the invoice exists
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Send the response with the invoice data
    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Error fetching invoice by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching the invoice",
      error: error.message,
    });
  }
};

module.exports = getUploadInvoiceById;
