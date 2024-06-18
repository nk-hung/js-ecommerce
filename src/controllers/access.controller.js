"use strict";

class AccessController {
  signUp(req, res) {
    return res.status(201).send({
      code: "20001",
      metadata: {
        shop: "abck:w",
      },
    });
  }
}

module.exports = new AccessController();
