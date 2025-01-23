const Invoice = require("../../../database/models/InvoiceModel");

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params; // Get the invoice ID from the request parameters

    // Validate if the invoice exists
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ 
        success: false, 
        message: "Invoice not found" 
      });
    }

    // Delete the invoice
    await Invoice.findByIdAndDelete(id);

    // Send response
    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting invoice",
      error: error.message,
    });
  }
};

module.exports = deleteInvoice;
