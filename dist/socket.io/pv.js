"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPvsDetails = void 0;
const socket_Pvs_Helpers_1 = require("../utils/socket.Pvs.Helpers");
const sendPvsDetails = async (io) => {
    io.of("/pv").on("connection", async (socket) => {
        await (0, socket_Pvs_Helpers_1.fetchAllPvMessages)(io, socket);
        await (0, socket_Pvs_Helpers_1.createNewMessage)(io, socket);
        await (0, socket_Pvs_Helpers_1.uploadVoice)(io, socket);
        await (0, socket_Pvs_Helpers_1.uploadLocation)(io, socket);
        await (0, socket_Pvs_Helpers_1.uploadMedia)(io, socket);
        await (0, socket_Pvs_Helpers_1.removeMessageFromTwoWay)(io, socket);
        socket.on("joining", (data) => {
            const { sender, receiver } = data;
            const prevChat = Array.from(socket.rooms);
            socket.leave(prevChat[1]);
            socket.leave(prevChat[2]);
            socket.join(`${sender}-${receiver}`);
            socket.join(`${receiver}-${sender}`);
            socket.emit("pvInfo", data);
        });
    });
};
exports.sendPvsDetails = sendPvsDetails;
