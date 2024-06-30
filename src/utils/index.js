"use strict";

const _ = require("lodash");
const crypto = require("crypto");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const generateKeyPair = () => {
  const publicKey = crypto.randomBytes(64).toString("hex");
  const privateKey = crypto.randomBytes(64).toString("hex");
  return { publicKey, privateKey };
};

module.exports = {
  getInfoData,
  generateKeyPair,
};
