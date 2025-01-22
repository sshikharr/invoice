const Business = require("../../../database/models/businessModel");

const updateBusiness = async (req, res) => {
  try {
    const { businessId } = req.params; // Extract businessId from params
    const adminId = req.adminId; // Authenticated admin's ID from middleware
    const updates = req.body; // Fields to update

    // Validate if the business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        message: "Business not found.",
      });
    }

    // Check if the admin is the owner of the business
    if (business.ownerId.toString() !== adminId) {
      return res.status(403).json({
        message: "You are not authorized to update this business.",
      });
    }

    // Perform the update
    Object.assign(business, updates);
    business.updatedBy = adminId; // Update the updatedBy field
    await business.save();

    res.status(200).json({
      message: "Business updated successfully.",
      business,
    });
  } catch (error) {
    console.error("Error updating business:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      message: "Server error, please try again later.",
    });
  }
};

module.exports = updateBusiness;
