const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler.helper");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keytoken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPairs = async (payload, publicKey, privateKey) => {
  try {
    // create accessToken
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`Error verify:::`, err);
      } else {
        console.log(`Decode verify:::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("error", error);
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request!");

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  const decodedUser = jwt.verify(accessToken, keyStore.publicKey);
  if (userId !== decodedUser.userId) {
    throw new AuthFailureError("Invalid User");
  }
  req.keyStore = keyStore;
  return next();
});

module.exports = {
  createTokenPairs,
  authentication,
};
