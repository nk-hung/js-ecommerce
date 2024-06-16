const express = require("express");
const router = express.Router();

router.use("api/v1", require("./shop.route"));

module.exports = router;
