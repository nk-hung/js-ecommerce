const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Keytoken";
const COLLECTION_NAME = "Keytokens";

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    privateKey: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
