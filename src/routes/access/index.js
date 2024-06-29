const express = require("express");

const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../middlewares/asyncHandler.middleware");

const router = express.Router();

router.post("/shop/signup", asyncHandler(accessController.signUp));
module.exports = router;
