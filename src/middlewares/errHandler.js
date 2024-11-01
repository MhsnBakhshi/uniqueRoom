const { errorResponse } = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

exports.errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errors = [];

    err.inner.forEach((e) => {
      errors.push({
        field: e.path,
        message: e.message,
      });
    });

    console.log({ success: false, error: "Validation Error" });
    return errorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Validation Error",
      errors
    );
  }

  let status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "INTERNAL SERVER ERROR";

  console.log({ success: false, error: message });

  return errorResponse(res, status, message);
};
