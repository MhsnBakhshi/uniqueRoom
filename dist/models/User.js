"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    profile: {
        type: String,
    },
    bio: {
        type: String,
        required: false,
        default: "Hey There I am using UniqueRoom WebApp.",
        trim: true,
    },
    roles: {
        type: [String],
        enum: ["ADMIN", "USER"],
        default: ["USER"],
    },
}, { timestamps: true });
const UserModel = (0, mongoose_1.model)("User", schema);
exports.default = UserModel;
