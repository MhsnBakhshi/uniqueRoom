"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
exports.default = async (socket, next) => {
    var _a;
    try {
        const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            console.log("Authentication error: Token not provided");
            return next(new Error("Authentication error: Token not provided"));
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User_1.default.findOne({ _id: payload.userId });
        if (!user) {
            console.log("User Not Found !!");
            return next(new Error("User Not Found !!"));
        }
        socket.user = user;
        next();
    }
    catch (error) {
        console.log("Authentication error on socketConnection: ", error);
        return next(new Error("Authentication error on socketConnection"));
    }
};
