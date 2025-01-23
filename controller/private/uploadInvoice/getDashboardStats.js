const UploadInvoice = require("../../../database/models/uploadInvoiceModel");

const getDashboardStats = async (req, res) => {
  try {
    // Aggregation to get total invoices, pending invoices, total amount, and average amount
    const stats = await UploadInvoice.aggregate([
      {
        $group: {
          _id: null, // Grouping all invoices together
          totalInvoices: { $count: {} }, // Count total number of invoices
          totalAmount: { $sum: "$invoiceAmount" }, // Sum of all invoice amounts
          averageAmount: { $avg: "$invoiceAmount" }, // Average of all invoice amounts
          pendingInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }, // Count pending invoices
          },
        },
      },
    ]);

    // Check if data exists and respond
    if (stats.length > 0) {
      res.status(200).json({
        success: true,
        data: stats[0], // Return the first aggregation result
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          totalInvoices: 0,
          totalAmount: 0,
          averageAmount: 0,
          pendingInvoices: 0,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

module.exports = getDashboardStats;
