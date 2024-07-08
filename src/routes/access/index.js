const express = require("express");

const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler.helper");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));

// authentication
router.use(authentication);

// logout
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/handlerRefreshToken",
  asyncHandler(accessController.refreshToken),
);

module.exports = router;
