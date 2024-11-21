"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });
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
}, { timestamps: true });
const roomSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
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
const namespaceSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    href: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    rooms: {
        type: [roomSchema],
        default: [],
    },
}, { timestamps: true });
const NamespaceModel = (0, mongoose_1.model)("Namespace", namespaceSchema);
exports.default = NamespaceModel;
