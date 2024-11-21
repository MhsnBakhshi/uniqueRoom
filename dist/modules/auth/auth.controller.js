"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.send = void 0;
const auth_validator_1 = require("./auth.validator");
const response_1 = require("../../utils/response");
const http_status_codes_1 = require("http-status-codes");
const Ban_1 = __importDefault(require("../../models/Ban"));
const User_1 = __importDefault(require("../../models/User"));
const helper_1 = require("../../utils/helper");
const send = async (req, res, next) => {
    try {
        const { phone } = req.body;
        await auth_validator_1.sendValidatorSchema.validate({ phone }, { abortEarly: false });
        const isBanned = await Ban_1.default.findOne({ phone });
        if (isBanned) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.FORBIDDEN, "You are already banned !!");
            return;
        }
        const { expired, remainingTime } = await (0, helper_1.getOtpDetails)(phone);
        if (!expired) {
            (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, {
                message: `Otp already sent in your phone, please try agian in: ${remainingTime}`,
            });
            return;
        }
        const otp = await (0, helper_1.generateOtpCode)(phone, 4);
        // sendSMS(phone, otp);
        (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, {
            message: "Otp sent successfully.",
        });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.send = send;
const verify = async (req, res, next) => {
    try {
        const { phone, otp } = req.body;
        await auth_validator_1.verifyValidatorSchema.validate({ phone, otp }, { abortEarly: false });
        const mainOtp = await (0, helper_1.cachOtpFromRedis)(phone);
        if (!mainOtp) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "Otp expired or wrong !!",
            });
            return;
        }
        if (+mainOtp !== +otp) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "Otp is not correct !!",
            });
            return;
        }
        const existUser = await User_1.default.findOne({ phone });
        if (existUser) {
            (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, {
                user: existUser,
                token: (0, helper_1.generateToken)(existUser._id),
            });
            return;
        }
        const isFirstUser = (await User_1.default.countDocuments()) === 2;
        const user = await User_1.default.create({
            phone,
            roles: isFirstUser ? ["ADMIN"] : ["USER"],
        });
        (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, {
            message: "User registed successfully :))",
            user,
            token: (0, helper_1.generateToken)(user._id),
        });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.verify = verify;
