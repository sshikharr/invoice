const Admin = require("../../../database/models/adminModel");
const Vendor = require("../../../database/models/vendorModel");
const Invoice = require("../../../database/models/InvoiceModel");

// Delete Invoice Controller
const deleteInvoice = async (req, res) => {
  const { invoiceId } = req.params;

  try {
    // Find the invoice by ID
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    // Find the admin and vendor linked to this invoice
    const admin = await Admin.findById(invoice.AdminId);
    const vendor = await Vendor.findById(invoice.vendorId);

    if (!admin || !vendor) {
      return res.status(404).json({ message: "Admin or Vendor not found." });
    }

    // Remove the invoice ID from the admin's and vendor's invoices array
    admin.invoices = admin.invoices.filter((id) => id.toString() !== invoiceId);
    vendor.invoices = vendor.invoices.filter(
      (id) => id.toString() !== invoiceId
    );

    // Save the updated admin and vendor
    await admin.save();
    await vendor.save();

    // Delete the invoice from the database
    await Invoice.findByIdAndDelete(invoiceId);

    // Respond with a success message
    res.status(200).json({ message: "Invoice deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = deleteInvoice;
