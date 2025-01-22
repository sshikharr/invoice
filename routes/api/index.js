const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));

router.use("/invoice", require("./invoice"));

router.use("/vendor", require("./vendor"));

router.use("/business", require("./business"));

router.use("/uploadInvoice", require("./uploadInvoice"));

module.exports = router;
