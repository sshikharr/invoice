const Admin = require("../../../database/models/adminModel");
const Vendor = require("../../../database/models/vendorModel");
const Invoice = require("../../../database/models/InvoiceModel");
const generateInvoicePDF = require("../../../utils/generateInvoicePDF");

const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params; // Invoice ID from request parameters
    const {
      subTitle,
      invoiceDate,
      dueDate,
      businessLogoUrl,
      billedBy,
      items,
      discount,
      additionalCharges,
      shippingCharges,
      total,
      signatureUrl,
      contactDetails,
      shippingDetails,
      vendorId
    } = req.body;

    const ownerId = req.adminId; // Assuming user info is in req.adminId (auth middleware)

    // Validate owner existence
    const owner = await Admin.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Validate vendor existence
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Find the existing invoice
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Update the invoice fields
    invoice.subTitle = subTitle || invoice.subTitle;
    invoice.invoiceDate = invoiceDate ? new Date(invoiceDate) : invoice.invoiceDate;
    invoice.dueDate = dueDate ? new Date(dueDate) : invoice.dueDate;
    invoice.businessLogoUrl = businessLogoUrl || invoice.businessLogoUrl;
    invoice.billedBy = billedBy || invoice.billedBy;
    invoice.items = items ? items.map(item => ({
      name: item.name,
      description: item.description,
      thumbnailUrl: item.thumbnailUrl,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.quantity * item.rate,
      hsn: item.hsn,
      unit: item.unit,
      tax: item.tax || 0
    })) : invoice.items;
    invoice.discount = discount || invoice.discount;
    invoice.additionalCharges = additionalCharges || invoice.additionalCharges;
    invoice.shippingCharges = shippingCharges || invoice.shippingCharges;
    invoice.total = total || invoice.total;
    invoice.signatureUrl = signatureUrl || invoice.signatureUrl;
    invoice.contactDetails = contactDetails || invoice.contactDetails;
    invoice.shippingDetails = shippingDetails || invoice.shippingDetails;
    invoice.vendorId = vendorId || invoice.vendorId;

    // Save the updated invoice
    await invoice.save();

    // Generate updated PDF
    const pdf = await generateInvoicePDF({
      subTitle: invoice.subTitle,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      businessLogoUrl: invoice.businessLogoUrl,
      billedBy: invoice.billedBy,
      items: invoice.items,
      discount: invoice.discount,
      additionalCharges: invoice.additionalCharges,
      shippingCharges: invoice.shippingCharges,
      total: invoice.total,
      signatureUrl: invoice.signatureUrl,
      contactDetails: invoice.contactDetails,
      shippingDetails: invoice.shippingDetails
    });

    // Send response
    res.status(200).json({
      message: "Invoice updated successfully",
      invoice,
      pdf: pdf.toString('base64')
    });

  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({
      message: "Error updating invoice",
      error: error.message
    });
  }
};

module.exports = updateInvoice;
