const Vendor = require("../../../database/models/vendorModel");
const Admin = require("../../../database/models/adminModel");

const updateVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const updates = req.body;
    const adminId = req.adminId;

    // Verify the vendor exists and belongs to the admin
    const vendor = await Vendor.findOne({ _id: vendorId, ownerId: adminId });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Check if email or phoneNumber is being updated and validate uniqueness
    if (updates.email || updates.phoneNumber) {
      const existingVendor = await Vendor.findOne({
        $or: [
          { email: updates.email || undefined },
          { phoneNumber: updates.phoneNumber || undefined },
        ],
        _id: { $ne: vendorId }, // Exclude the current vendor from the check
      });

      if (existingVendor) {
        return res.status(400).json({
          message:
            "Another vendor already exists with this phone number or email.",
        });
      }
    }

    // Handle nested fields for updates (e.g., taxInformation, billingAddress, etc.)
    const nestedFields = [
      "taxInformation",
      "billingAddress",
      "shippingDetails",
      "bankDetails",
    ];
    nestedFields.forEach((field) => {
      if (updates[field]) {
        vendor[field] = { ...vendor[field].toObject(), ...updates[field] };
        delete updates[field]; // Remove from the main updates to prevent overwriting as a whole object
      }
    });

    // Update remaining vendor properties dynamically
    Object.keys(updates).forEach((key) => {
      vendor[key] = updates[key];
    });

    // Save updated vendor details
    await vendor.save();

    res.status(200).json({
      message: "Vendor updated successfully",
      vendor: vendor.toObject(),
    });
  } catch (error) {
    console.error("Error updating vendor:", error);

    // Handle specific validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate key error",
        field: Object.keys(error.keyPattern)[0],
      });
    }

    res.status(500).json({
      message: "Server error, please try again later.",
    });
  }
};

module.exports = updateVendor;
