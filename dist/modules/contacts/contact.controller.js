"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = void 0;
const mongoose_1 = require("mongoose");
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utils/response");
const contact_validators_1 = require("./contact.validators");
const Contact_1 = __importDefault(require("../../models/Contact"));
const User_1 = __importDefault(require("../../models/User"));
const add = async (req, res, next) => {
    try {
        const user = req.user;
        const { contactId, nickname, favorite } = req.body;
        await contact_validators_1.contactValidatorSchema.validate({ nickname, favorite }, { abortEarly: false });
        if (!(0, mongoose_1.isValidObjectId)(contactId)) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "contactId is not valid",
            });
            return;
        }
        const isExistUser = await User_1.default.findById(contactId);
        if (!isExistUser) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "contact not found !!",
            });
            return;
        }
        const existingContact = await Contact_1.default.findOne({
            "contacts.user": contactId,
        });
        if (existingContact) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "contact is already exist in your contacts.",
            });
            return;
        }
        const contacts = [
            {
                user: contactId,
                nickname,
                favorite,
            },
        ];
        const newContact = await Contact_1.default.create({
            user: user._id,
            contacts,
        });
        (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.CREATED, {
            message: "contact added.",
            newContact,
        });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.add = add;
