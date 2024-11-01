const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const { StatusCodes } = require("http-status-codes");
const { setHeaders } = require("./middlewares/headers");
const { errorHandler } = require("./middlewares/errHandler");
const { errorResponse } = require("./utils/response");
const authRouther = require("./modules/auth/auth.router");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(setHeaders);
app.use(express.static(path.join(__dirname, "../", "public")));

app.use("/auth", authRouther);

app.use((req, res) => {
  console.log(`This Path Not Found ${req.path}`);

  return errorResponse(
    res,
    StatusCodes.NOT_FOUND,
    `This Path Not Found ${req.path}`
  );
});

app.use(errorHandler);

module.exports = app;
