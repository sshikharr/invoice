const {
  createVendor,
  deleteVendor,
  getVendors,
  updateVendor,
  getVendorById,
} = require("./Vendor");
const {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoices,
} = require("./Invoice");

module.exports = {
  //invoice
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoices,
  //vendor
  createVendor,
  deleteVendor,
  getVendors,
  updateVendor,
  getVendorById,
};
