const Vendor = require("../../../database/models/vendorModel");

const getVendorById = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const adminId = req.adminId;

    // Find the vendor by vendorId and adminId
    const vendor = await Vendor.findOne({ _id: vendorId, ownerId: adminId });
    
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ vendor });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = getVendorById;
