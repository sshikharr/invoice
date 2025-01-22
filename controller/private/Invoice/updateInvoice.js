const Admin = require("../../../database/models/adminModel");
const Vendor = require("../../../database/models/vendorModel");
const Invoice = require("../../../database/models/InvoiceModel");

// Update Invoice Controller
const updateInvoice = async (req, res) => {
  const { invoiceId } = req.params;
  const {
    items,
    subtotal,
    discount,
    tax,
    shipping,
    total,
    amountPaid,
    balanceDue,
    status,
  } = req.body;

  try {
    // Find the invoice by ID
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    // Update invoice details
    invoice.items = items || invoice.items;
    invoice.subtotal = subtotal || invoice.subtotal;
    invoice.discount = discount || invoice.discount;
    invoice.tax = tax || invoice.tax;
    invoice.shipping = shipping || invoice.shipping;
    invoice.total = total || invoice.total;
    invoice.amountPaid = amountPaid || invoice.amountPaid;
    invoice.balanceDue = balanceDue || invoice.balanceDue;
    invoice.status = status || invoice.status;

    // Save the updated invoice
    await invoice.save();

    // Respond with the updated invoice
    res.status(200).json({ message: "Invoice updated successfully.", invoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = updateInvoice;
