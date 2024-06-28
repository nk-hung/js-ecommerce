const jwt = require("jsonwebtoken");

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

module.exports = {
  createTokenPairs,
};
