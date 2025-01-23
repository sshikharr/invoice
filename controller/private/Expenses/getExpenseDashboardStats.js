const Expenses = require("../../../database/models/expensesModel");

const getExpenseDashboardStats = async (req, res) => {
  try {
    // Aggregation to get total expenses, average expenses, top category, and top vendors
    const stats = await Expenses.aggregate([
      {
        $group: {
          _id: null, // Grouping all expenses together
          totalExpenses: { $sum: "$amount" }, // Sum of all expense amounts
          averageExpenses: { $avg: "$amount" }, // Average of all expense amounts
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          totalExpenses: 1,
          averageExpenses: 1,
        },
      },
    ]);

    const topCategory = await Expenses.aggregate([
      {
        $group: {
          _id: "$category", // Group by category
          totalAmount: { $sum: "$amount" }, // Sum of amounts per category
        },
      },
      {
        $sort: { totalAmount: -1 }, // Sort by total amount in descending order
      },
      {
        $limit: 1, // Get the top category
      },
    ]);

    const topVendors = await Expenses.aggregate([
      {
        $group: {
          _id: "$vendorId", // Group by vendor
          totalAmount: { $sum: "$amount" }, // Sum of amounts per vendor
        },
      },
      {
        $sort: { totalAmount: -1 }, // Sort by total amount in descending order
      },
      {
        $limit: 5, // Get the top 5 vendors
      },
      {
        $lookup: {
          from: "vendors", // Collection to join
          localField: "_id",
          foreignField: "_id",
          as: "vendorDetails",
        },
      },
      {
        $unwind: "$vendorDetails", // Unwind the vendor details array
      },
      {
        $project: {
          _id: 0,
          vendorId: "$_id",
          vendorName: "$vendorDetails.name",
          totalAmount: 1,
        },
      },
    ]);

    // Send response
    res.status(200).json({
      success: true,
      data: {
        totalExpenses: stats[0]?.totalExpenses || 0,
        averageExpenses: stats[0]?.averageExpenses || 0,
        topCategory: topCategory[0]?._id || "N/A",
        topVendors: topVendors,
      },
    });
  } catch (error) {
    console.error("Error fetching expense dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching expense dashboard stats",
      error: error.message,
    });
  }
};

module.exports = getExpenseDashboardStats;