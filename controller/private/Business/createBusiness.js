const Business = require("../../../database/models/businessModel");
const Admin = require("../../../database/models/adminModel");

const createBusiness = async (req, res) => {
  try {
    const {
      contactInformation,
      address,
      legalName,
      tradeName,
      taxInformation,
      bankDetails,
    } = req.body;

    const adminId = req.adminId; 

    // Validate required fields
    if (!legalName || !contactInformation?.email || !contactInformation?.mobile) {
      return res.status(400).json({
        message: "Please provide legal name, email, and mobile number.",
      });
    }

    // Check if a business already exists with the same email
    const existingBusiness = await Business.findOne({
      "contactInformation.email": contactInformation.email,
    });
    if (existingBusiness) {
      return res.status(400).json({
        message: "A business already exists with this email.",
      });
    }

    // Check if a business already exists with the same mobile number
    const existingMobile = await Business.findOne({
      "contactInformation.mobile": contactInformation.mobile,
    });
    if (existingMobile) {
      return res.status(400).json({
        message: "A business already exists with this mobile number.",
      });
    }

    // Create a new business instance
    const newBusiness = new Business({
      contactInformation,
      address,
      legalName,
      tradeName,
      taxInformation,
      bankDetails,
      createdBy: adminId,
      updatedBy: adminId,
      ownerId: adminId,
    });

    // Save the business to the database
    await newBusiness.save();

    // Optionally, you can add this business to the Admin's list of businesses (if relevant)
    await Admin.findByIdAndUpdate(adminId, {
      $push: { businesses: newBusiness._id }, // Assumes Admin schema has a businesses array
    });

    res.status(201).json({
      message: "Business created successfully",
      business: newBusiness,
    });
  } catch (error) {
    console.error("Error creating business:", error);

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

module.exports = createBusiness;
