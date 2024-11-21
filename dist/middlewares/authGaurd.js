"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const response_1 = require("../utils/response");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "token not provided !!",
            });
            return;
        }
        const token = req.headers.authorization.split(" ");
        if (token[0] !== "Bearer") {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, {
                message: "only Bearer token is supported",
            });
            return;
        }
        const msinToken = token[1];
        const payloadedUser = (jsonwebtoken_1.default.verify(msinToken, process.env.JWT_SECRET_KEY));
        const user = await User_1.default.findOne({
            _id: payloadedUser.userId,
        });
        if (!user) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "User not found from this token",
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
};
