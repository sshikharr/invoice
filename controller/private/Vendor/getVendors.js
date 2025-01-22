const Vendor = require("../../../database/models/vendorModel");

const searchVendors = async (req, res) => {
  const { businessId, searchQuery } = req.query;

  try {
    // Build the base filter
    const filters = {};

    // Apply businessId filter if present
    if (businessId) {
      filters.businessId = businessId;
    }

    // Perform the initial search with the businessId filter if it exists
    let vendors = await Vendor.find(filters).limit(10);

    // Apply searchQuery filter if present
    if (searchQuery) {
      // If searchQuery exists, filter the already filtered vendors
      vendors = vendors.filter(vendor => {
        return (
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.phoneNumber.includes(searchQuery) ||
          (vendor.taxInformation.gstin &&
            vendor.taxInformation.gstin.includes(searchQuery)) ||
          (vendor.taxInformation.pan && vendor.taxInformation.pan.includes(searchQuery))
        );
      });
    }

    if (vendors.length === 0) {
      return res.status(404).json({ message: "No vendors found." });
    }

    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error searching vendors:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = searchVendors;
