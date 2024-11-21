"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delProfile = exports.setProfile = exports.changeRole = exports.editProfileInfo = exports.ban = void 0;
const User_1 = __importDefault(require("../../models/User"));
const Ban_1 = __importDefault(require("../../models/Ban"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const user_validators_1 = require("./user.validators");
const response_1 = require("../../utils/response");
const ban = async (req, res, next) => {
    var _a;
    try {
        if (!((_a = req.user.roles) === null || _a === void 0 ? void 0 : _a.includes("ADMIN"))) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.FORBIDDEN, {
                message: "You have not access to use this rote",
            });
            return;
        }
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "id is not valid",
            });
            return;
        }
        const deletedUser = await User_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "user not found",
            });
            return;
        }
        await Ban_1.default.create({ phone: deletedUser.phone });
        (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, "User banned");
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.ban = ban;
const editProfileInfo = async (req, res, next) => {
    try {
        const { name, email, bio } = req.body;
        const user = await User_1.default.findOne({
            _id: req.user._id,
        });
        await user_validators_1.editUserInfoValidator.validate({ name, email, bio }, { abortEarly: false });
        if (!user) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "user not found",
            });
            return;
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        await user.save();
        (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, { message: "User Updated." });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.editProfileInfo = editProfileInfo;
const changeRole = async (req, res, next) => {
    var _a, _b;
    try {
        if (!((_a = req.user.roles) === null || _a === void 0 ? void 0 : _a.includes("ADMIN"))) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.FORBIDDEN, {
                message: "You have not access to use this rote",
            });
            return;
        }
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "id is not valid",
            });
            return;
        }
        const user = await User_1.default.findById(id);
        if (user) {
            if ((_b = user.roles) === null || _b === void 0 ? void 0 : _b.includes("USER")) {
                user.roles = ["ADMIN"];
            }
            else {
                user.roles = ["USER"];
            }
            await user.save();
            (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, { message: "role changed." });
            return;
        }
        (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
            message: "User not found from this id",
        });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.changeRole = changeRole;
const setProfile = async (req, res, next) => {
    try {
        const user = req.user;
        if (!req.file) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "No File uploaded !!",
            });
            return;
        }
        const profilePath = `/profiles/${req.file.filename}`;
        await User_1.default.findByIdAndUpdate(user._id, {
            profile: profilePath,
        });
        (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, {
            message: "profile uploaded!!",
        });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.setProfile = setProfile;
const delProfile = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.user._id);
        if (!(user === null || user === void 0 ? void 0 : user.profile)) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "User has not upoloaded profile yet !!",
            });
            return;
        }
        fs_1.default.unlinkSync(path_1.default.join(__dirname, "..", "..", "..", "/public", user === null || user === void 0 ? void 0 : user.profile));
        user.profile = undefined;
        await user.save();
        (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, {
            message: "profile Deleted!!",
        });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.delProfile = delProfile;
