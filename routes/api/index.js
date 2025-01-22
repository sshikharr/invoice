const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));

router.use("/invoice", require("./invoice"));

router.use("/vendor", require("./vendor"));

router.use("/business", require("./business"));

module.exports = router;
