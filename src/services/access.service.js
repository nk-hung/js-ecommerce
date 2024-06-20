const bcrypt = require("bcrypt");
const crypto = require("crypto");

const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keytoken.service");
const { createTokenPairs } = require("../auth/authUtils");

const RoleShop = {
  ROLE: "ROLE",
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
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publishKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "Shop already registered",
          };
        }

        const tokens = await createTokenPairs(
          { userId: newShop._id, email },
          publicKey,
          privateKey,
        );
        console.log({ privateKey, publicKey });

        return {
          code: 201,
          metadata: {
            shop: newShop,
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

module.exports = new AccessService();
