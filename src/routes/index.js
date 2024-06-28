const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// check apiKey
router.use(apiKey);

// check permisison
router.use(permission("0000"));

// router
router.use("/v1/api", require("./access"));
router.use("/v1/api", require("./shop.route"));

module.exports = router;
