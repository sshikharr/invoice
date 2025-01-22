const Vendor = require("../../../database/models/vendorModel");

const searchVendors = async (req, res) => {
  const { businessName, searchQuery } = req.query;

  try {
    // Build the base filter
    const filters = {};

    // Apply businessName filter if present
    if (businessName) {
      filters.businessName = { $regex: businessName, $options: "i" };
    }

    // Apply searchQuery filter if present
    if (searchQuery) {
      const searchFilters = {
        $or: [
          { email: { $regex: searchQuery, $options: "i" } },
          { phoneNumber: { $regex: searchQuery, $options: "i" } },
          { GSTIN: { $regex: searchQuery, $options: "i" } },
        ],
      };
      // Combine filters: if businessName exists, apply search within it
      if (businessName) {
        filters.$and = [filters, searchFilters];
      } else {
        Object.assign(filters, searchFilters);
      }
    }

    // Perform the search with the built filters
    const vendors = await Vendor.find(filters).limit(10);

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
