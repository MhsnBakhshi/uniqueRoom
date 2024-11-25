"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradeDetails = exports.remove = exports.add = void 0;
const mongoose_1 = require("mongoose");
const response_1 = require("../../utils/response");
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../../models/User"));
const Pv_1 = __importDefault(require("../../models/Pv"));
const add = async (req, res, next) => {
    try {
        const { receiver, isBlocked, isPinned } = req.body;
        const user = req.user;
        if (!(0, mongoose_1.isValidObjectId)(receiver)) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "receiver is not valid id",
            });
            return;
        }
        const isExistReceiver = !!(await User_1.default.findOne({
            _id: receiver,
        }));
        if (!isExistReceiver) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "receiver not found check id",
            });
            return;
        }
        const newPv = await Pv_1.default.create({
            sender: user._id,
            receiver,
            isBlocked,
            isPinned,
        });
        (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.CREATED, {
            message: "Pv created successfully",
            data: newPv,
        });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.add = add;
const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "id not valid ObjectId!!",
            });
            return;
        }
        const pv = await Pv_1.default.findOneAndDelete({ _id: id });
        if (!pv) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "pv not found!!",
            });
            return;
        }
        (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, { message: "Pv deleted." });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
const upgradeDetails = async (req, res, next) => {
    try {
        const { id, isBlocked, isPinned } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "id not valid ObjectId!!",
            });
            return;
        }
        const pv = await Pv_1.default.findOne({ _id: id });
        if (!pv) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "pv not found!!",
            });
            return;
        }
        pv.isBlocked = isBlocked || pv.isBlocked;
        pv.isPinned = isPinned || pv.isPinned;
        await pv.save();
        (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, {
            message: "pv updated successfully",
        });
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.upgradeDetails = upgradeDetails;
