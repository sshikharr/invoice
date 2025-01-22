const createInvoice = require("./createInvoice");
const dashboard = require("./dashboard");
const deleteInvoice = require("./deleteInvoice");
const getInvoices = require("./getInvoices");
const updateInvoice = require("./updateInvoice");

module.exports = {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoices,
  dashboard,
};
