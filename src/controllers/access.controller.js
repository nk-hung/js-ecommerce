"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  async logout(req, res) {
    console.log("VAO", req.keyStore);
    new SuccessResponse({
      message: "Logout",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  }

  async login(req, res, next) {
    new SuccessResponse({
      message: "Login success",
      metadata: await AccessService.login(req.body),
    }).send(res);
  }

  async signUp(req, res, next) {
    new CREATED({
      message: "Registed success!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 12,
      },
    }).send(res);
  }

  async refreshToken(req, res, next) {
    new SuccessResponse({
      message: "Get token success",
      metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    }).send(res);
  }
}

module.exports = new AccessController();
