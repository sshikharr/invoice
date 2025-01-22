const Business = require("../../../database/models/businessModel");

const getBusiness = async (req, res) => {
  try {
    const adminId = req.adminId; // Authenticated admin's ID from request (assumes middleware sets this)

    // Retrieve all businesses created by the authenticated admin
    const businesses = await Business.find({ ownerId: adminId });

    // Check if the admin has created any businesses
    if (!businesses.length) {
      return res.status(404).json({
        message: "No businesses found for this admin.",
      });
    }

    res.status(200).json({
      message: "Businesses retrieved successfully.",
      businesses,
    });
  } catch (error) {
    console.error("Error fetching businesses:", error);

    res.status(500).json({
      message: "Server error, please try again later.",
    });
  }
};

module.exports = getBusiness;
