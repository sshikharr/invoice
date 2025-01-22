const Business = require("../../../database/models/businessModel");

const deleteBusiness = async (req, res) => {
  try {
    const { businessId } = req.params; // Extract businessId from params
    const adminId = req.adminId; // Authenticated admin's ID from middleware

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
        message: "You are not authorized to delete this business.",
      });
    }

    // Delete the business
    await Business.findByIdAndDelete(businessId);

    res.status(200).json({
      message: "Business deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting business:", error);

    res.status(500).json({
      message: "Server error, please try again later.",
    });
  }
};

module.exports = deleteBusiness;
