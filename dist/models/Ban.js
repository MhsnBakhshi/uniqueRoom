"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, { timestamps: true });
const BanModel = (0, mongoose_1.model)("Ban", schema);
exports.default = BanModel;
