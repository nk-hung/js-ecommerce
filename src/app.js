require("dotenv").config();
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

require("./databases/init.mongo");

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

app.use("", require("./routes"));

module.exports = app;
