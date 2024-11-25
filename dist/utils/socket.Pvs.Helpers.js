"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLocation = exports.uploadMedia = exports.uploadVoice = exports.removeMessageFromTwoWay = exports.fetchAllPvMessages = exports.createNewMessage = void 0;
const Pv_1 = __importDefault(require("../models/Pv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createNewMessage = async (io, socket) => {
    socket.on("newMessage", async (data) => {
        const { content, sender, receiver } = data;
        const messages = await Pv_1.default.findOneAndUpdate({ sender, receiver }, {
            $push: {
                messages: {
                    sender,
                    receiver,
                    content,
                },
            },
        }, { upsert: true });
        io.of("/pv")
            .in(`${sender}-${receiver}`)
            .in(`${receiver}-${sender}`)
            .emit("confirmMessage", { ...data, messages });
    });
};
exports.createNewMessage = createNewMessage;
const fetchAllPvMessages = async (io, socket) => {
    socket.on("getAllMessage", async (data) => {
        const { sender, receiver } = data;
        const chat = await Pv_1.default.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        })
            .populate("messages.sender", "name phone")
            .populate("messages.receiver", "name phone");
        socket.emit("allMessages", (chat === null || chat === void 0 ? void 0 : chat.messages) || []);
    });
};
exports.fetchAllPvMessages = fetchAllPvMessages;
const removeMessageFromTwoWay = async (io, socket) => {
    socket.on("removeMessage", async (data) => {
        const { messageId, sender, receiver } = data;
        if (!messageId || !sender || !receiver) {
            socket.emit("error", { message: "Invalid data provided for removal." });
            return;
        }
        const chat = await Pv_1.default.findOneAndUpdate({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        }, {
            $pull: {
                messages: { _id: messageId },
            },
        }, { new: true });
        if (!chat) {
            socket.emit("error", { message: "Chat not found." });
            return;
        }
        io.of("/pv")
            .in(`${sender}-${receiver}`)
            .in(`${receiver}-${sender}`)
            .emit("confirmRemoveMsg", { removed: true, messageId });
    });
};
exports.removeMessageFromTwoWay = removeMessageFromTwoWay;
const uploadVoice = async (io, socket) => {
    socket.on("newPvVoice", async (data) => {
        const { filename, file, sender, receiver } = data;
        const pv = await Pv_1.default.findOne({
            sender,
            receiver,
        });
        if (!pv) {
            socket.emit("error", {
                message: "pv not found from this sender and receiver",
            });
            return;
        }
        const allowedExtensions = [".mp3", ".wav", ".ogg"];
        const ext = path_1.default.extname(filename).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            socket.emit("error", {
                message: "Invalid file format for voice message!",
            });
            return;
        }
        const voicePath = `${path_1.default.join(__dirname, "../../public/pv/voice")}${String(Date.now() + ext)}`;
        fs_1.default.writeFile(voicePath, file, async (err) => {
            if (!err) {
                await Pv_1.default.updateOne({
                    _id: pv._id,
                    sender: pv.sender,
                    receiver: pv.receiver,
                }, {
                    $push: {
                        media: {
                            sender,
                            path: voicePath,
                            type: "voice",
                        },
                    },
                });
                io.of("/pv")
                    .in(`${sender}-${receiver}`)
                    .in(`${receiver}-${sender}`)
                    .emit("confirmPvVoice", data);
            }
            else {
                console.error("Error On Uploading voice ->", err);
                return;
            }
        });
    });
};
exports.uploadVoice = uploadVoice;
const uploadMedia = async (io, socket) => {
    socket.on("newMedia", async (data) => {
        const { filename, file, sender, receiver } = data;
        const pv = await Pv_1.default.findOne({
            sender,
            receiver,
        });
        if (!pv) {
            socket.emit("error", {
                message: "pv not found from this sender and receiver",
            });
            return;
        }
        const ext = path_1.default.extname(filename);
        const mediaPath = `${path_1.default.join(__dirname, "../../public/pv/uploads")}${String(Date.now() + ext)}`;
        fs_1.default.writeFile(mediaPath, file, async (err) => {
            if (!err) {
                await Pv_1.default.updateOne({
                    _id: pv._id,
                    sender: pv.sender,
                    receiver: pv.receiver,
                }, {
                    $push: {
                        media: {
                            sender,
                            path: mediaPath,
                            type: "media",
                        },
                    },
                });
                io.of("/pv")
                    .in(`${sender}-${receiver}`)
                    .in(`${receiver}-${sender}`)
                    .emit("confirmPvVoice", data);
            }
            else {
                console.error("Error On Uploading media ->", err);
                return;
            }
        });
    });
};
exports.uploadMedia = uploadMedia;
const uploadLocation = async (io, socket) => {
    socket.on("newPvLocation", async (data) => {
        const { location, receiver, sender } = data;
        const pv = await Pv_1.default.findOne({
            sender,
            receiver,
        });
        if (!pv) {
            socket.emit("error", {
                message: "pv not found from this sender and receiver",
            });
            return;
        }
        await Pv_1.default.updateOne({ _id: pv._id, sender, receiver }, {
            $push: {
                locations: {
                    sender,
                    x: location.x,
                    y: location.y,
                },
            },
        });
        io.of("/pv")
            .in(`${sender}-${receiver}`)
            .in(`${receiver}-${sender}`)
            .emit("confirmPvLocation", data);
    });
};
exports.uploadLocation = uploadLocation;
