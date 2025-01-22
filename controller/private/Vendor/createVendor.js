const Vendor = require("../../../database/models/vendorModel");
const Admin = require("../../../database/models/adminModel");

const createVendor = async (req, res) => {
  try {
    const {
      businessId,
      name,
      email,
      phoneNumber,
      taxInformation,
      billingAddress,
      shippingDetails,
      address,
      bankDetails,
      logo,
    } = req.body;

    if (!name || !phoneNumber || !email) {
      return res.status(400).json({
        message:
          "Please fill in all required fields (name, email, phone number).",
      });
    }

    const adminId = req.adminId;

    // Check if a vendor already exists with the same email
    const existingEmail = await Vendor.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Vendor already exists with this email.",
      });
    }

    // Check if a vendor already exists with the same phone number
    const existingPhoneNumber = await Vendor.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      return res.status(400).json({
        message: "Vendor already exists with this phone number.",
      });
    }

    // Create new vendor
    const vendor = new Vendor({
      businessId,
      name,
      email,
      phoneNumber,
      taxInformation: {
        gstin: taxInformation?.gstin,
        pan: taxInformation?.pan,
      },
      billingAddress,
      shippingDetails,
      adress,
      bankDetails,
      logo,
      ownerId: adminId,
      createdBy: adminId,
    });

    await vendor.save();

    // Add vendor to admin's vendors array
    await Admin.findByIdAndUpdate(adminId, {
      $push: { vendors: vendor._id },
    });

    res.status(201).json({
      message: "Vendor created successfully",
      vendor: {
        ...vendor.toObject(),
      },
    });
  } catch (error) {
    console.error("Error creating vendor:", error);

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

module.exports = createVendor;
