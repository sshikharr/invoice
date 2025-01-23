const Invoice = require("../../../database/models/InvoiceModel");

const getInvoices = async (req, res) => {
  const { minAmount, maxAmount, dateRange, subTitle } = req.query;

  try {
    // Build the base filter object
    const filters = {};

    // Apply amount range filter if provided
    if (minAmount || maxAmount) {
      filters.total = {};
      if (minAmount) {
        filters.total.$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        filters.total.$lte = parseFloat(maxAmount);
      }
    }

    // Apply date range filter
    if (dateRange) {
      const today = new Date();
      let startDate, endDate;

      switch (dateRange) {
        case "thisWeek":
          startDate = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week
          endDate = new Date(); // Current date
          break;
        case "thisMonth":
          startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the month
          endDate = new Date(); // Current date
          break;
        case "thisYear":
          startDate = new Date(today.getFullYear(), 0, 1); // Start of the year
          endDate = new Date(); // Current date
          break;
        case "beforeYear":
          endDate = new Date(today.getFullYear() - 1, 11, 31); // End of last year
          break;
        default:
          break;
      }

      if (startDate) filters.invoiceDate = { ...filters.invoiceDate, $gte: startDate };
      if (endDate) filters.invoiceDate = { ...filters.invoiceDate, $lte: endDate };
    }

    // Fetch filtered invoices
    let invoices = await Invoice.find(filters)
      .populate("ownerId", "name") // Populate owner details
      .populate("vendorId", "name") // Populate vendor details
      .sort({ invoiceDate: -1 }); // Sort by invoice date in descending order

    // Apply subtitle search filter on the filtered results
    if (subTitle) {
      const searchRegex = new RegExp(subTitle, "i"); // Case-insensitive regex
      invoices = invoices.filter(invoice => searchRegex.test(invoice.subTitle));
    }

    // Send response
    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching invoices",
      error: error.message,
    });
  }
};

module.exports = getInvoices;
