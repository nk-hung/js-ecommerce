"use strict";

const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      //
      // return tokens;
      //
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  static removeKeyById = async (_id) => {
    return await keytokenModel.deleteOne({ _id });
  };

  static findByRefreshTokenUsed = async (rt) => {
    return await keytokenModel.findOne({ refreshTokensUsed: rt }).lean();
  };

  static findByRefreshToken = async (rt) => {
    return await keytokenModel.findOne({ refreshToken: rt });
  };

  static deleteKeyById = async (userId) => {
    return await keytokenModel.deleteOne({ user: userId });
  };
}

module.exports = KeyTokenService;
