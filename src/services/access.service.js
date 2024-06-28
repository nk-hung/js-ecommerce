const bcrypt = require("bcrypt");
const crypto = require("crypto");

const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keytoken.service");
const { createTokenPairs } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: "SHOP",
  ADMIN: "ADMIN",
  WRITTER: "WRITTER",
  EDITOR: "EDITOR",
};

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
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        console.table({ publicKey, privateKey });
        const keyStores = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStores) {
          return {
            code: "xxx",
            message: "keyStores error",
          };
        }

        const tokens = await createTokenPairs(
          { userId: newShop._id, email },
          publicKey,
          privateKey,
        );

        return {
          code: 201,
          metadata: {
            shop: getInfoData({ fields: ["name", "_id"], object: newShop }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        data: null,
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

module.exports = AccessService;
