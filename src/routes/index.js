const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hus hu",
  });
});
router.use("/v1/api", require("./shop.route"));

module.exports = router;
