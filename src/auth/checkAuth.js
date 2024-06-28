"use strict";

const { findById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "FORBIDEN Error",
      });
    }
    // check objKey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "FORBIDEN",
      });
    }

    req.objKey = objKey;
    next();
  } catch (error) {
    console.log("Apikey error:::", error);
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    const validPermissions = req.objKey.permissions.includes(permission);
    if (!validPermissions) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }
    next();
  };
};
module.exports = {
  apiKey,
  permission,
};
