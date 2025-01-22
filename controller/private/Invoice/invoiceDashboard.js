const Invoice = require("../../../database/models/InvoiceModel");

const invoiceDashboard = async (req, res) => {
  try {
    const adminId = req.adminId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get dashboard statistics
    const stats = await Invoice.aggregate([
      {
        $match: { ownerId: adminId },
      },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalAmount: { $sum: "$total" },
          averageAmount: { $avg: "$total" },
          pendingInvoices: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Get latest invoices with pagination
    const latestInvoices = await Invoice.find({ ownerId: adminId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("vendorId", "name email phoneNumber")
      .lean();

    // Get total count for pagination
    const totalCount = await Invoice.countDocuments({ ownerId: adminId });

    const dashboardStats = stats[0] || {
      totalInvoices: 0,
      totalAmount: 0,
      averageAmount: 0,
      pendingInvoices: 0,
    };

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalInvoices: dashboardStats.totalInvoices,
          totalAmount: Math.round(dashboardStats.totalAmount * 100) / 100,
          averageAmount: Math.round(dashboardStats.averageAmount * 100) / 100,
          pendingInvoices: dashboardStats.pendingInvoices,
        },
        latestInvoices: {
          invoices: latestInvoices,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalInvoices: totalCount,
            hasMore: page * limit < totalCount,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};

module.exports = invoiceDashboard;