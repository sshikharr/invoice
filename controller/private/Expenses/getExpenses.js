const Expenses = require("../../../database/models/expensesModel");

const getExpenses = async (req, res) => {
  const { status, businessId, minAmount, maxAmount, searchQuery, category } = req.query;

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
      filters.amount = {};
      if (minAmount) {
        filters.amount.$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        filters.amount.$lte = parseFloat(maxAmount);
      }
    }

    // Apply category filter if present
    if (category && category !== "All Categories") {
      filters.category = category;
    }

    // Base query
    let query = Expenses.find(filters)
      .populate('businessId', 'name') // Populate business details
      .populate('ownerId', 'name')   // Populate owner details
      .sort({ date: -1 });           // Sort by date descending

    // Apply search filter if present
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i'); // Case-insensitive regex
      query = query.find({
        $or: [
          { description: searchRegex },
          { category: searchRegex }, // Allow search on category if needed
        ],
      });
    }

    // Execute the query
    const expenses = await query;

    // Send response
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });

  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching expenses",
      error: error.message,
    });
  }
};

module.exports = getExpenses;
