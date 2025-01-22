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
  dashboard,
} = require("./Invoice");
const {
  createBusiness,
  updateBusiness,
  getBusiness,
  deleteBusiness,
} = require("./Business");

module.exports = {
  //invoice
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoices,
  dashboard,
  //vendor
  createVendor,
  deleteVendor,
  getVendors,
  updateVendor,
  getVendorById,
  //busniness
  createBusiness,
  updateBusiness,
  getBusiness,
  deleteBusiness,
};
