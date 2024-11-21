"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = async (res, statusCode = 200, data) => {
    return res
        .status(statusCode)
        .json({ status: statusCode, success: true, data });
};
exports.successResponse = successResponse;
const errorResponse = async (res, statusCode, data) => {
    return res
        .status(statusCode)
        .json({ status: statusCode, success: false, data });
};
exports.errorResponse = errorResponse;
