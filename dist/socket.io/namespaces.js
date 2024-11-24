"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNamespaceRooms = exports.initConnection = void 0;
const socket_Namspaces_Helpers_1 = require("../utils/socket.Namspaces.Helpers");
const Namespace_1 = __importDefault(require("../models/Namespace"));
const initConnection = (io) => {
    io.on("connection", async (socket) => {
        try {
            const user = socket.user;
            if (!user) {
                console.log("User Not Authenticated Or Token Not Provided !!");
                socket.emit("error", "User Not Authenticated Or Token Not Provided !!");
                return;
            }
            const namespaces = await (0, socket_Namspaces_Helpers_1.fetchNamespaces)(user._id);
            const pvs = await (0, socket_Namspaces_Helpers_1.fetchPvs)(user._id);
            socket.emit("setUp", {
                Namespaces: namespaces || [],
                Pvs: pvs || [],
            });
            socket.on("disconnect", () => {
                console.log("User disconnected");
            });
        }
        catch (err) {
            console.log({ message: "Error On Socket Connection!!", err });
            socket.emit("error", { message: "Error On Socket Connection!!", err });
        }
    });
};
exports.initConnection = initConnection;
const getNamespaceRooms = (io) => {
    io.on("namespacesRooms", async (socket) => {
        try {
            const user = socket.user;
            if (!user) {
                console.log("User Not Authenticated Or Token Not Provided !!");
                socket.emit("error", "User Not Authenticated Or Token Not Provided !!");
                return;
            }
            const namespaces = await Namespace_1.default.find({
                creator: user._id,
            }).lean();
            namespaces.forEach((namespace) => {
                io.of(namespace.href).on("connection", async (socket) => {
                    await (0, socket_Namspaces_Helpers_1.fetchMessage)(io, socket);
                    await (0, socket_Namspaces_Helpers_1.fetchLocation)(io, socket);
                    await (0, socket_Namspaces_Helpers_1.fetchMedia)(io, socket);
                    await (0, socket_Namspaces_Helpers_1.fetchVoice)(io, socket);
                    socket.emit("getNamespacesRoom", namespace.rooms);
                    socket.on("joining", async (newRoom) => {
                        var _a;
                        const lastRoom = Array.from(socket.rooms)[1];
                        if (lastRoom) {
                            socket.leave(lastRoom);
                            await (0, socket_Namspaces_Helpers_1.fetchRoomOnlineUsers)(io, namespace.href, lastRoom);
                        }
                        socket.join(newRoom);
                        await (0, socket_Namspaces_Helpers_1.fetchRoomOnlineUsers)(io, namespace.href, newRoom);
                        const roomInfo = (_a = namespace.rooms) === null || _a === void 0 ? void 0 : _a.find((room) => room.title === newRoom);
                        socket.emit("roomInfo", roomInfo);
                        socket.on("disconnect", async () => {
                            await (0, socket_Namspaces_Helpers_1.fetchRoomOnlineUsers)(io, namespace.href, newRoom);
                        });
                    });
                });
            });
        }
        catch (err) {
            console.log({ message: "Error On Socket Connection!!", err });
            socket.emit("error", {
                message: "Error On GetNamespaceeRooms Connection!!",
                err,
            });
        }
    });
};
exports.getNamespaceRooms = getNamespaceRooms;
