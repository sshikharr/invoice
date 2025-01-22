const createInvoice = require("./createInvoice");
const deleteInvoice = require("./deleteInvoice");
const getInvoices = require("./getInvoices");
const invoiceDashboard = require("./invoiceDashboard");
const updateInvoice = require("./updateInvoice");

module.exports = {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoices,
  invoiceDashboard
};
