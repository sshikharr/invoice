const Vendor = require("../../../database/models/vendorModel");

const searchVendors = async (req, res) => {
  const { name, searchQuery } = req.query;

  try {
    // Build the base filter
    const filters = {};

    // Apply name filter if present
    if (name) {
      filters.name = { $regex: name, $options: "i" }; // Updated from 'businessName' to 'name' per the schema
    }

    // Apply searchQuery filter if present
    if (searchQuery) {
      const searchFilters = {
        $or: [
          { email: { $regex: searchQuery, $options: "i" } },
          { phoneNumber: { $regex: searchQuery, $options: "i" } },
          { "taxInformation.gstin": { $regex: searchQuery, $options: "i" } }, // Updated GSTIN to match the schema
          { "taxInformation.pan": { $regex: searchQuery, $options: "i" } }, // Added PAN for additional search
        ],
      };
      // Combine filters: if name exists, apply search within it
      if (name) {
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
