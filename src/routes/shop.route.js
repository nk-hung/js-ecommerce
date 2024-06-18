const express = require("express");
const router = express.Router();

router.get("/user", (req, res) => {});

router.post("/user", (req, res) => {
  res.status(200).send(JSON.stringify(req.body));
});

module.exports = router;
