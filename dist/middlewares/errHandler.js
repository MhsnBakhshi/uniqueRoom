"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const response_1 = require("../utils/response");
const http_status_codes_1 = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
    if (err.name === "ValidationError") {
        const errors = [];
        err.inner.forEach((e) => {
            errors.push({
                field: e.path || "unknown",
                message: e.message,
            });
        });
        console.log({ success: false, error: "Validation Error" });
        (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, `Validation Error => ${errors}`);
        return;
    }
    let status = err.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let message = err.message || "INTERNAL SERVER ERROR";
    console.log({ success: false, error: message });
    (0, response_1.errorResponse)(res, status, message);
    return;
};
exports.errorHandler = errorHandler;
