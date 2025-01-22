const Invoice = require("../../../database/models/InvoiceModel");

const getInvoices = async (req, res) => {
  try {
    const { status, business, minAmt, maxAmt } = req.query;
    const adminId = req.adminId;
    const { description } = req.body;

    // Base query object
    let query = {
      adminId: adminId // Always filter by adminId
    };

    // Add filters only if they are provided and not empty strings
    if (status && status !== '') {
      query.status = status;
    }

    if (business && business !== '') {
      query['billedBy.businessName'] = { 
        $regex: new RegExp(business, 'i') // Case-insensitive search
      };
    }

    // Add amount range filter if either min or max is provided
    if ((minAmt && minAmt !== '') || (maxAmt && maxAmt !== '')) {
      query.total = {};
      
      if (minAmt && minAmt !== '') {
        query.total.$gte = parseFloat(minAmt);
      }
      
      if (maxAmt && maxAmt !== '') {
        query.total.$lte = parseFloat(maxAmt);
      }
    }

    // Add description search if provided
    if (description && description !== '') {
      query['items.description'] = {
        $regex: new RegExp(description, 'i') // Case-insensitive search
      };
    }

    // Execute query with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const invoices = await Invoice.find(query)
      .populate('vendorId', 'name email phone') // Populate vendor details
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Invoice.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        invoices,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error in getInvoices:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = getInvoices;
