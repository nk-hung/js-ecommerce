const bcrypt = require("bcrypt");

const shopModel = require("../models/shop.model");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // Check email exist or not
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop already registered",
        };
      }
      const hashPassword = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: hashPassword,
      });
      return {
        code: "xxx",
        message: "Create success~",
        data: newShop,
      };
    } catch (error) {
      return {
        code: 123,
        status: "error",
        message: error.message,
      };
    }
  };
}

module.exports = new AccessService();
