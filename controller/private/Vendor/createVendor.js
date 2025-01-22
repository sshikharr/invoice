const Vendor = require("../../../database/models/vendorModel");
const Admin = require("../../../database/models/adminModel");

const createVendor = async (req, res) => {
  try {
    const {
      businessName,
      vendorIndustry,
      country,
      cityTown,
      vatNumber,
      billingAddress,
      shippingDetails,
      businessAlias,
      email,
      phoneNumber,
      showEmailInInvoice,
      showPhoneInInvoice,
      customFields,
      GSTIN,
      PAN,
      logo,
      attachmentUrls,
    } = req.body;

    if (!businessName || !phoneNumber || !email || !country) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
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
      logo,
      businessName,
      vendorIndustry,
      country,
      cityTown,
      vatNumber,
      billingAddress,
      shippingDetails,
      businessAlias,
      email,
      phoneNumber,
      showEmailInInvoice,
      showPhoneInInvoice,
      attachments: attachmentUrls,
      customFields,
      GSTIN,
      PAN,
      adminId,
      status: "Active",
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
        logo,
        attachments: attachmentUrls,
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
