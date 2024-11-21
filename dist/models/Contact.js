"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const contactSchemaItem = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    nickname: {
        type: String,
        default: "",
    },
    favorite: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const schema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    contacts: {
        type: [contactSchemaItem],
        default: [],
    },
}, { timestamps: true });
const ContactModel = (0, mongoose_1.model)("Contact", schema);
exports.default = ContactModel;
