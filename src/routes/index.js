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

// handling error
router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

router.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = router;
