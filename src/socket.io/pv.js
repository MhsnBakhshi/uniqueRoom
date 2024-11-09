const User = require("../models/User");
const { getNewPvMessage, removePvMsg } = require("../utils/socketHelpers");
exports.initPvConnection = (io) => {
  io.on("connection", async (socket) => {
    const users = await User.find({}).sort({ _id: -1 });
    socket.emit("privateChats", users);
  });
};

exports.sendPvs = (io) => {
  io.of("/pvs").on("connection", (pvSocket) => {
    getNewPvMessage(io, pvSocket);
    removePvMsg(io, pvSocket);

    pvSocket.on("joining", (data) => {
      const { sender, receiver } = data;
      const prevChat = Array.from(pvSocket.rooms);

      pvSocket.leave(prevChat[1]);
      pvSocket.leave(prevChat[2]);

      pvSocket.join(`${sender}-${receiver}`);
      pvSocket.join(`${receiver}-${sender}`);

      pvSocket.emit("pvInfo", data);
    });
  });
};
