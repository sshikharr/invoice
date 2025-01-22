const UploadInvoice = require("../../../database/models/uploadInvoiceModel");

const getUploadInvoices = async (req, res) => {
  const { status, businessId, minAmount, maxAmount, searchQuery } = req.query;

  try {
    // Build the base filter object
    const filters = {};

    // Apply status filter if present and not "All Statuses"
    if (status && status !== "All Statuses") {
      filters.status = status;
    }

    // Apply business filter if present and not "All Businesses"
    if (businessId && businessId !== "All Businesses") {
      filters.businessId = businessId;
    }

    // Apply amount range filters if present
    if (minAmount || maxAmount) {
      filters.invoiceAmount = {};
      if (minAmount) {
        filters.invoiceAmount.$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        filters.invoiceAmount.$lte = parseFloat(maxAmount);
      }
    }

    // Create the base query
    let query = UploadInvoice.find(filters)
      .populate('businessId', 'name') // Populate business details
      .populate('vendorId', 'name')   // Populate vendor details
      .sort({ date: -1 });            // Sort by date descending

    // Apply search filter if present
    if (searchQuery) {
      query = query.where('description', new RegExp(searchQuery, 'i'));
    }

    // Execute the query
    const invoices = await query;

    // Send response
    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });

  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching invoices",
      error: error.message
    });
  }
};

module.exports = getUploadInvoices;