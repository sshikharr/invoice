const Invoice = require("../../../database/models/InvoiceModel");

const invoiceDashboard = async (req, res) => {
  try {
    // Perform aggregation to get total invoices, total amount, and average amount
    const summary = await Invoice.aggregate([
      {
        $group: {
          _id: null, // Grouping all invoices together
          totalInvoices: { $count: {} }, // Count total number of invoices
          totalAmount: { $sum: "$total" }, // Sum of all invoice totals
          averageAmount: { $avg: "$total" }, // Average of all invoice totals
        },
      },
    ]);

    // Check if summary exists and return it
    if (summary.length > 0) {
      res.status(200).json({
        success: true,
        data: summary[0], // We get the result in an array, so take the first element
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          totalInvoices: 0,
          totalAmount: 0,
          averageAmount: 0,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching invoice summary:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching invoice summary",
      error: error.message,
    });
  }
};

module.exports = invoiceDashboard;
