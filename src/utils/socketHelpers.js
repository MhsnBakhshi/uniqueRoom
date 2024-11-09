const path = require("path");
const fs = require("fs");
const Namespace = require("../models/Namespace");
const User = require("../models/User");

const getMessage = async (io, socket) => {
  socket.on("newMsg", async (data) => {
    const { message, roomName, sender } = data;

    const namespace = await Namespace.findOne({ "rooms.title": roomName });

    await Namespace.updateOne(
      { _id: namespace._id, "rooms.title": roomName },
      {
        $push: {
          "rooms.$.messages": {
            sender,
            message,
          },
        },
      }
    );

    io.of(namespace.href).in(roomName).emit("confirmMsg", data);
  });

  detectIsTyping(io, socket);
};

const detectIsTyping = async (io, socket) => {
  socket.on("isTyping", async (data) => {
    const { userID, roomName, isTyping } = data;
    const namespace = await Namespace.findOne({ "rooms.title": roomName });
    const user = await User.findOne({ _id: userID });

    io.of(namespace.href)
      .in(roomName)
      .emit("isTyping", { isTyping, username: user.username });

    if (!isTyping) {
      await getRoomOnlineUsers(io, namespace.href, roomName);
    }
  });
};

const getRoomOnlineUsers = async (io, href, roomName) => {
  const onlineUsers = await io.of(href).in(roomName).allSockets();
  io.of(href)
    .in(roomName)
    .emit("onlineUsersCount", Array.from(onlineUsers).length);
};

const getLocation = (io, socket) => {
  socket.on("newLocation", async (data) => {
    const { roomName, sender, location } = data;

    const namespace = await Namespace.findOne({ "rooms.title": roomName });

    await Namespace.updateOne(
      {
        _id: namespace._id,
        "rooms.title": roomName,
      },
      {
        $push: {
          "rooms.$.locations": {
            sender,
            x: location.x,
            y: location.y,
          },
        },
      }
    );

    io.of(namespace.href).in(roomName).emit("confirmLocation", data);
  });
};

const getMedia = (io, socket) => {
  socket.on("newMedia", async (data) => {
    const { filename, file, sender, roomName } = data;
    const namespace = await Namespace.findOne({ "rooms.title": roomName });
    const ext = path.extname(filename);
    const mediaPath = `room/images/${String(Date.now() + ext)}`;

    fs.writeFile(`public/${mediaPath}`, file, async (err) => {
      if (!err) {
        await Namespace.updateOne(
          {
            _id: namespace._id,
            "rooms.title": roomName,
          },
          {
            $push: {
              "rooms.$.media": {
                sender,
                path: mediaPath,
              },
            },
          }
        );

        io.of(namespace.href).in(roomName).emit("confirmMedia", data);
      } else {
        return new Error("err on get media");
      }
    });
  });
};
const getNewPvMessage = async (io, pvSocket) => {
  pvSocket.on("newMsg", async (data) => {
    const { pv } = data;
    const msgID = Math.floor(Math.random() * 99999);

    io.of("/pvs")
      .in(`${pv.sender}-${pv.receiver}`)
      .in(`${pv.receiver}-${pv.sender}`)
      .emit("confirmMsg", { ...data, msgID });
  });
};

const removePvMsg = (io, pvSocket) => {
  pvSocket.on("removeMsg", (data) => {
    const rooms = Array.from(pvSocket.rooms);

    io.of("/pvs").in(rooms[1]).in(rooms[2]).emit("confirmRemoveMsg", data);
  });
};

module.exports = {
  getMessage,
  detectIsTyping,
  getRoomOnlineUsers,
  getLocation,
  getMedia,
  getNewPvMessage,
  removePvMsg,
};
