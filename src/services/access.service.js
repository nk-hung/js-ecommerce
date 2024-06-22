const bcrypt = require("bcrypt");
const crypto = require("crypto");

const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keytoken.service");
const { createTokenPairs } = require("../auth/authUtils");

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
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        });
        // PublicKey phải được lưu vào DB còn privateKey thì không
        // Public Key phải chuyển sang dạnh HashString vì RSA không thể lưu trực tiếp vào MongoDB
        // Mà chúng ta phải chuyển về dạng JSON string để lưu vào
        // Khi chúng ta lấy public từ Mongo ra thì phải chuyển về publicKey
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

        const publicKeyObject = crypto.createPublicKey(publicKeyString);

        const tokens = await createTokenPairs(
          { userId: newShop._id, email },
          publicKeyObject,
          privateKey,
        );

        console.log("tokens:::", tokens);
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

module.exports = AccessService;
