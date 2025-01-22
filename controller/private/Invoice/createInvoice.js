const Admin = require("../../../database/models/adminModel");
const Vendor = require("../../../database/models/vendorModel");
const Invoice = require("../../../database/models/InvoiceModel");
const generateInvoicePDF = require("../../../utils/generateInvoicePDF");

const createInvoice = async (req, res) => {
  const {
    subTitle,
    invoiceNumber,
    invoiceDate,
    dueDate,
    businessLogoUrl,
    billedBy,
    billedTo,
    items,
    discount,
    additionalCharges,
    shippingCharges,
    tax,
    total,
    signatureUrl,
    contactDetails,
    shippingDetails,
  } = req.body;

  const adminId = req.adminId;

  try {
    // Validate Admin existence
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Validate Vendor existence
    const vendor = await Vendor.findById(billedTo.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    // Create a new Invoice
    const newInvoice = new Invoice({
      adminId,
      vendorId: billedTo.vendorId,
      subTitle,
      invoiceNumber,
      invoiceDate,
      dueDate,
      businessLogoUrl,
      billedBy,
      billedTo,
      items,
      discount,
      additionalCharges,
      shippingCharges,
      tax,
      total,
      signatureUrl,
      contactDetails,
      shippingDetails,
    });

    // Save the Invoice
    await newInvoice.save();

    // Initialize invoices arrays if undefined
    admin.invoices = admin.invoices || [];
    vendor.invoices = vendor.invoices || [];

    // Associate the Invoice with Admin and Vendor
    admin.invoices.push(newInvoice._id);
    vendor.invoices.push(newInvoice._id);
    await admin.save();
    await vendor.save();

    const pdf = await generateInvoicePDF({
      subTitle,
      invoiceNumber,
      invoiceDate,
      dueDate,
      businessLogoUrl,
      billedBy,
      billedTo,
      items,
      discount,
      additionalCharges,
      shippingCharges,
      total,
      signatureUrl,
      contactDetails,
      shippingDetails,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${invoiceNumber}.pdf`,
    });

    // Send response with the PDF
    res.status(201).send({
      pdf: pdf.toString("base64"),
      message: "Invoice created successfully!",
    });
  } catch (err) {
    console.error("Error creating invoice:", err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = createInvoice;
