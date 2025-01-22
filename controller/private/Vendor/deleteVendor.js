const Vendor = require("../../../database/models/vendorModel");
const Admin = require("../../../database/models/adminModel");

const deleteVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const adminId = req.adminId;

    const vendor = await Vendor.findOne({ _id: vendorId });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Remove vendor from admin's vendor array
    await Admin.findByIdAndUpdate(adminId, {
      $pull: { vendors: vendorId },
    });

    await Vendor.findByIdAndDelete(vendorId);

    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = deleteVendor;
