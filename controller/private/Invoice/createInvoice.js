const Admin = require("../../../database/models/adminModel");
const Vendor = require("../../../database/models/vendorModel");
const Invoice = require("../../../database/models/InvoiceModel");
const generateInvoicePDF = require("../../../utils/generateInvoicePDF");

const createInvoice = async (req, res) => {
  try {
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

    const ownerId = req.adminId; // Assuming you have user info in req.user from auth middleware

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


    // Create new invoice
    const newInvoice = new Invoice({
      ownerId,
      createdBy: ownerId,
      vendorId,
      subTitle,
      invoiceDate: new Date(invoiceDate),
      dueDate: new Date(dueDate),
      businessLogoUrl,
      billedBy,
      items: items.map(item => ({
        name: item.name,
        description: item.description,
        thumbnailUrl: item.thumbnailUrl,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.quantity * item.rate,
        hsn: item.hsn,
        unit: item.unit,
        tax: item.tax || 0
      })),
      discount: discount || 0,
      additionalCharges: additionalCharges || 0,
      shippingCharges: shippingCharges || 0,
      total,
      signatureUrl,
      contactDetails,
      shippingDetails
    });

    // Save the invoice
    await newInvoice.save();

    // Generate PDF
    const pdf = await generateInvoicePDF({
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
      shippingDetails
    });

    // Send response
    res.status(201).json({
      message: "Invoice created successfully",
      invoice: newInvoice,
      pdf: pdf.toString('base64')
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ 
      message: "Error creating invoice", 
      error: error.message 
    });
  }
};

module.exports = createInvoice;