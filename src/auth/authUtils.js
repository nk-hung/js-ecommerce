const JWT = require("jsonwebtoken");

const createTokenPairs = async (payload, publicKey, privateKey) => {
  try {
    // create accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "rs256",
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "rs256",
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`Error verify:::`, err);
      } else {
        console.log(`Decode verify:::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

module.exports = {
  createTokenPairs,
};
