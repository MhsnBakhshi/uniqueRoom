"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTyping = exports.fetchRoomOnlineUsers = exports.fetchVoice = exports.fetchMedia = exports.fetchLocation = exports.fetchMessage = exports.fetchPvs = exports.fetchNamespaces = void 0;
const Namespace_1 = __importDefault(require("../models/Namespace"));
const Pv_1 = __importDefault(require("../models/Pv"));
const User_1 = __importDefault(require("../models/User"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fetchNamespaces = async (userId) => {
    try {
        const namespaces = await Namespace_1.default.find({
            creator: userId,
        }).sort({
            _id: -1,
        });
        return namespaces;
    }
    catch (error) {
        console.log("Error On Fetching Namespaces From DB", error);
        return [];
    }
};
exports.fetchNamespaces = fetchNamespaces;
const fetchPvs = async (userId) => {
    try {
        const pvs = await Pv_1.default.find({
            $or: [{ receiver: userId }, { sender: userId }],
        }).sort({
            _id: -1,
        });
        return pvs;
    }
    catch (error) {
        console.log("Error On Fetching Pvs From DB", error);
        return [];
    }
};
exports.fetchPvs = fetchPvs;
const fetchMessage = async (io, socket) => {
    socket.on("newMessage", async (data) => {
        const { content, sender, roomName } = data;
        const namespace = await Namespace_1.default.findOne({
            "rooms.title": roomName,
        });
        if (!namespace) {
            console.log({ message: "Namespace Not Found !!" });
            socket.emit("error", { message: "Namespace Not Found !!" });
            return;
        }
        await Namespace_1.default.updateOne({
            _id: namespace._id,
            "rooms.title": roomName,
        }, {
            $push: {
                "rooms.$.messages": {
                    sender,
                    content,
                },
            },
        });
        io.of(namespace.href).in(roomName).emit("confirmMessage", data);
    });
    (0, exports.isTyping)(io, socket);
};
exports.fetchMessage = fetchMessage;
const fetchLocation = async (io, socket) => {
    socket.on("location", async (data) => {
        const { location, roomName, sender } = data;
        const namespace = await Namespace_1.default.findOne({
            "rooms.title": roomName,
        });
        if (!namespace) {
            console.log({ message: "Namespace Not Found !!" });
            socket.emit("error", { message: "Namespace Not Found !!" });
            return;
        }
        await Namespace_1.default.updateOne({ _id: namespace._id, "rooms.title": roomName }, {
            $push: {
                "rooms.$locations": {
                    sender,
                    x: location.x,
                    y: location.y,
                },
            },
        });
        io.of(namespace.href).in(roomName).emit("confirmLocations", data);
    });
};
exports.fetchLocation = fetchLocation;
const fetchMedia = async (io, socket) => {
    socket.on("newMedia", async (data) => {
        const { filename, file, sender, roomName } = data;
        const namespace = await Namespace_1.default.findOne({
            "rooms.title": roomName,
        });
        const ext = path_1.default.extname(filename);
        const mediaPath = `${path_1.default.join(__dirname, "../../public/room/uploads")}${String(Date.now() + ext)}`;
        fs_1.default.writeFile(mediaPath, file, async (err) => {
            if (!err) {
                await Namespace_1.default.updateOne({
                    _id: namespace === null || namespace === void 0 ? void 0 : namespace._id,
                    "rooms.title": roomName,
                }, {
                    $push: {
                        "rooms.$.media": {
                            sender,
                            path: mediaPath,
                            type: "media",
                        },
                    },
                });
                io.of(namespace.href).in(roomName).emit("confirmMedia", data);
            }
            else {
                console.error("Error On Uploading media ->", err);
                return;
            }
        });
    });
};
exports.fetchMedia = fetchMedia;
const fetchVoice = async (io, socket) => {
    socket.on("newVoice", async (data) => {
        const { filename, file, sender, roomName } = data;
        const namespace = await Namespace_1.default.findOne({
            "rooms.title": roomName,
        });
        const allowedExtensions = [".mp3", ".wav", ".ogg"];
        const ext = path_1.default.extname(filename).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            socket.emit("error", {
                message: "Invalid file format for voice message!",
            });
            return;
        }
        const voicePath = `${path_1.default.join(__dirname, "../../public/room/voice")}${String(Date.now() + ext)}`;
        fs_1.default.writeFile(voicePath, file, async (err) => {
            if (!err) {
                await Namespace_1.default.updateOne({
                    _id: namespace === null || namespace === void 0 ? void 0 : namespace._id,
                    "rooms.title": roomName,
                }, {
                    $push: {
                        "rooms.$.media": {
                            sender,
                            path: voicePath,
                            type: "voice",
                        },
                    },
                });
                io.of(namespace.href).in(roomName).emit("confirmVoice", data);
            }
            else {
                console.error("Error On Uploading voice ->", err);
                return;
            }
        });
    });
};
exports.fetchVoice = fetchVoice;
const fetchRoomOnlineUsers = async (io, href, roomName) => {
    const onlineUsers = await io.of(href).in(roomName).allSockets();
    io.of(href)
        .in(roomName)
        .emit("onlineUsersCount", Array.from(onlineUsers).length);
};
exports.fetchRoomOnlineUsers = fetchRoomOnlineUsers;
const isTyping = async (io, socket) => {
    socket.on("isTyping", async (data) => {
        const { userID, roomName, isTyping } = data;
        const namespace = await Namespace_1.default.findOne({
            "rooms.title": roomName,
        });
        const user = await User_1.default.findOne({ _id: userID });
        if (!namespace) {
            console.log({ message: "Namespace Not Found !!" });
            socket.emit("error", { message: "Namespace Not Found !!" });
            return;
        }
        if (!user) {
            console.log({ message: "User Not Found !!" });
            socket.emit("error", { message: "User Not Found !!" });
            return;
        }
        io.of(namespace.href)
            .in(roomName)
            .emit("isTyping", { isTyping, user: user.name || user.phone });
        if (!isTyping) {
            await (0, exports.fetchRoomOnlineUsers)(io, namespace.href, roomName);
        }
    });
};
exports.isTyping = isTyping;
