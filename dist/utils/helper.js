"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginationData = exports.generateToken = exports.sendSMS = exports.generateOtpCode = exports.cachOtpFromRedis = exports.getOtpDetails = exports.getOtpRedisPattern = void 0;
const request_1 = __importDefault(require("request"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redisConnection_1 = require("../configs/redisConnection");
const getOtpRedisPattern = (phone) => {
    return `otp:${phone}`;
};
exports.getOtpRedisPattern = getOtpRedisPattern;
const getOtpDetails = async (phone) => {
    const otp = await redisConnection_1.redis.get(getOtpRedisPattern(phone));
    if (!otp) {
        return {
            expired: true,
            remainingTime: 0,
        };
    }
    const remainingTime = await redisConnection_1.redis.ttl(getOtpRedisPattern(phone));
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    return {
        expired: false,
        remainingTime: formattedTime,
    };
};
exports.getOtpDetails = getOtpDetails;
const generateOtpCode = async (phone, expiredTime) => {
    let otp = Math.floor(Math.random() * 999999);
    otp = 123456;
    await redisConnection_1.redis.set(getOtpRedisPattern(phone), otp, "EX", expiredTime * 60);
    return otp;
};
exports.generateOtpCode = generateOtpCode;
const cachOtpFromRedis = async (phone) => {
    const otp = await redisConnection_1.redis.get(getOtpRedisPattern(phone));
    if (!otp) {
        return false;
    }
    else {
        return otp;
    }
};
exports.cachOtpFromRedis = cachOtpFromRedis;
const sendSMS = (phone, otp) => {
    request_1.default.post({
        url: "http://ippanel.com/api/select",
        body: {
            op: "pattern",
            user: process.env.FARAZSMSUSER,
            pass: process.env.FARAZSMSPASSWORD,
            fromNum: +process.env.FARAZSMSNUMBER,
            toNum: phone,
            patternCode: process.env.FARAZSMSPATTERNCODE,
            inputData: [{ "login-code": otp }],
        },
        json: true,
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if (typeof response.body !== "number" &&
                Number(response.body[0]) !== 0) {
                throw new Error(response.body[1]);
            }
            return true;
        }
    });
};
exports.sendSMS = sendSMS;
const generateToken = (userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "365d",
    });
    return token;
};
exports.generateToken = generateToken;
const createPaginationData = (page, limit, totalCount, collectionName) => ({
    page,
    limit,
    totalPage: Math.ceil(totalCount / limit),
    ["total" + collectionName]: totalCount,
});
exports.createPaginationData = createPaginationData;
