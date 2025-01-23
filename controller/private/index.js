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
  invoiceDashboard,
} = require("./Invoice");
const { 
  createBusiness, 
  updateBusiness,
  getBusiness,
  deleteBusiness
} = require("./Business");

const {
  createUploadInvoice,
  getUploadInvoices,
  getUploadInvoiceById,
  getDashboardStats
} = require("./uploadInvoice");

const {
  createExpenses,
  getExpenses,
  getExpenseDashboardStats
} = require("./Expenses");

module.exports = {
  //invoice
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoices,
  invoiceDashboard,
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
  //uploadInvoice
  createUploadInvoice,
  getUploadInvoices,
  getUploadInvoiceById,
  getDashboardStats,
  //expenses
  createExpenses,
  getExpenses,
  getExpenseDashboardStats
};
