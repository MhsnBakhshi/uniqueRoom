const Namespace = require("../models/Namespace");
const {
  getMessage,
  detectIsTyping,
  getRoomOnlineUsers,
  getLocation,
  getMedia,
} = require("../utils/socketHelpers");

exports.initConnection = async (io) => {
  io.on("connection", async (socket) => {
    const namespaces = await Namespace.find({}).sort({ _id: -1 });
    socket.emit("namespaces", namespaces);
  });
};

exports.getNameSpaceRoomsData = async (io) => {
  const namespaces = await Namespace.find({}).lean();

  namespaces.forEach((namespace) => {
    io.of(namespace.href).on("connection", async (socket) => {
      let mainNamespace = await Namespace.findOne({
        _id: namespace._id,
      });

      getMessage(io, socket);
      getLocation(io, socket);
      getMedia(io, socket);

      socket.emit("namespaceRooms", mainNamespace.rooms);

      socket.on("joining", async (newRoom) => {
        const lastRoom = Array.from(socket.rooms)[1];

        mainNamespace = await NamespaceModel.findOne({
          _id: namespace._id,
        });

        if (lastRoom) {
          socket.leave(lastRoom);
          await getRoomOnlineUsers(io, mainNamespace.href, lastRoom);
        }

        socket.join(newRoom);
        await getRoomOnlineUsers(io, mainNamespace.href, newRoom);

        const roomInfo = mainNamespace.rooms.find(
          (room) => room.title === newRoom
        );
        socket.emit("roomInfo", roomInfo);

        socket.on("disconnect", async () => {
          await getRoomOnlineUsers(io, mainNamespace.href, newRoom);
        });
      });
    });
  });
};
