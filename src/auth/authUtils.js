const jwt = require("jsonwebtoken");

const createTokenPairs = async (payload, publicKey, privateKey) => {
  try {
    console.log("VAOO!!!!!");
    // create accessToken
    const accessToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    console.log("access tkoen::", accessToken);
    const refreshToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
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
    return error;
  }
};

module.exports = {
  createTokenPairs,
};
