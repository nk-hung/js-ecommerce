const bcrypt = require("bcrypt");

const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keytoken.service");
const { createTokenPairs, verifyJWT } = require("../auth/authUtils");
const { getInfoData, generateKeyPair } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  ADMIN: "ADMIN",
  WRITTER: "WRITTER",
  EDITOR: "EDITOR",
};

class AccessService {
  static handlerRefreshToken = async (rt) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(rt);
    if (foundToken) {
      // decode ra xem user nao dang dung access token cu
      const { userId, email } = verifyJWT(rt, foundToken.privateKey);
      console.log({ userId, email });
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened!! Please relogin");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(rt);
    if (!holderToken) throw new AuthFailureError("Shop not register!!");
    console.log("holderToken:::", holderToken);
    // verify token

    const { userId, email } = verifyJWT(rt, holderToken.privateKey);
    // check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not register!!");

    const tokens = await createTokenPairs(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey,
    );

    console.log("tokens::", tokens);
    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: foundShop.refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async (keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore._id);
  };
  /*
   * 1. Check email in db
   * 2. Match password
   * 3. Create AT vs RT
   * 4. Generate tokens
   * 5. get data return login
   * */
  static login = async ({ email, password }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registed!");

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Something wrong!");

    const { publicKey, privateKey } = generateKeyPair();

    const { _id: userId } = foundShop;

    const tokens = await createTokenPairs(
      { userId, email },
      publicKey,
      privateKey,
    );

    await KeyTokenService.createKeyToken({
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
      userId,
    });

    return {
      shop: getInfoData({
        fields: ["name", "_id", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // Check email exist or not
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registed!");
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      const { publicKey, privateKey } = generateKeyPair();

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
          shop: getInfoData({
            fields: ["name", "_id", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
  };
}

module.exports = AccessService;
