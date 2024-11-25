"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const locationSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const mediaSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    path: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ["media", "voice"],
        required: true,
    },
}, { timestamps: true });
const messageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const PvSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        trim: true,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        trim: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    messages: {
        type: [messageSchema],
        default: [],
    },
    media: {
        type: [mediaSchema],
        default: [],
    },
    locations: {
        type: [locationSchema],
        default: [],
    },
}, { timestamps: true });
const PvModel = (0, mongoose_1.model)("Pv", PvSchema);
exports.default = PvModel;
