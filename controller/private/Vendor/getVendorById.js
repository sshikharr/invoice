const Vendor = require("../../../database/models/vendorModel");

const getVendorById = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const adminId = req.adminId;
    
    // Conditionally finding single vendor and all vendors
    if(vendorId){
      const vendor = await Vendor.findOne({ _id: vendorId, adminId });
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      return res.status(200).json({ vendor });
    }else{
      const vendors = await Vendor.find({ adminId });
      res.status(200).json({ vendors });
    }
    
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = getVendorById;
