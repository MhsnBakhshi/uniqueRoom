const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const { StatusCodes } = require("http-status-codes");
const { setHeaders } = require("./middlewares/headers");
const { errorHandler } = require("./middlewares/errHandler");
const { errorResponse } = require("./utils/response");
const authRouther = require("./modules/auth/auth.router");
const userRouther = require("./modules/user/user.router");
const namespaceRouther = require("./modules/namespace/namespace.router");
const contactRouther = require("./modules/contacts/contact.router");

//? App Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(setHeaders);
app.use(express.static(path.join(__dirname, "../", "public")));

//? Routhers
app.use("/auth", authRouther);
app.use("/user", userRouther);
app.use("/namespace", namespaceRouther);
app.use("/contact", contactRouther);

//? 404 Error Handler
app.use((req, res) => {
  console.log(`This Path Not Found ${req.path}`);

  return errorResponse(
    res,
    StatusCodes.NOT_FOUND,
    `This Path Not Found ${req.path}`
  );
});

//? Error Global Handler
app.use(errorHandler);

module.exports = app;
