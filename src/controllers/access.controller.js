"use strict";

const { CREATED } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  async signUp(req, res, next) {
    new CREATED({
      message: "Registed success!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 12,
      },
    }).send(res);
  }
}

module.exports = new AccessController();
