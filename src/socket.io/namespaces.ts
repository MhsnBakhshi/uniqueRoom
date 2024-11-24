import { Server, Socket } from "socket.io";
import { ICustomSocket } from "../middlewares/socketAuthGaurd";
import {
  fetchLocation,
  fetchMedia,
  fetchMessage,
  fetchNamespaces,
  fetchPvs,
  fetchRoomOnlineUsers,
  fetchVoice,
} from "../utils/socket.Namspaces.Helpers";
import NamespaceModel from "../models/Namespace";

export const initConnection = (io: Server) => {
  io.on("connection", async (socket: Socket) => {
    try {
      const user = (socket as ICustomSocket).user;

      if (!user) {
        console.log("User Not Authenticated Or Token Not Provided !!");
        socket.emit("error", "User Not Authenticated Or Token Not Provided !!");
        return;
      }

      const namespaces = await fetchNamespaces(user._id);
      const pvs = await fetchPvs(user._id);

      socket.emit("setUp", {
        Namespaces: namespaces || [],
        Pvs: pvs || [],
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    } catch (err) {
      console.log({ message: "Error On Socket Connection!!", err });
      socket.emit("error", { message: "Error On Socket Connection!!", err });
    }
  });
};

export const getNamespaceRooms = (io: Server) => {
  io.on("namespacesRooms", async (socket: Socket) => {
    try {
      const user = (socket as ICustomSocket).user;

      if (!user) {
        console.log("User Not Authenticated Or Token Not Provided !!");
        socket.emit("error", "User Not Authenticated Or Token Not Provided !!");
        return;
      }

      const namespaces = await NamespaceModel.find({
        creator: user._id,
      }).lean();

      namespaces.forEach((namespace) => {
        io.of(namespace.href).on("connection", async (socket: Socket) => {
          await fetchMessage(io, socket);
          await fetchLocation(io, socket);
          await fetchMedia(io, socket);
          await fetchVoice(io, socket);

          socket.emit("getNamespacesRoom", namespace.rooms);

          socket.on("joining", async (newRoom) => {
            const lastRoom = Array.from(socket.rooms)[1];

            if (lastRoom) {
              socket.leave(lastRoom);
              await fetchRoomOnlineUsers(io, namespace.href, lastRoom);
            }

            socket.join(newRoom);
            await fetchRoomOnlineUsers(io, namespace.href, newRoom);

            const roomInfo = namespace.rooms?.find(
              (room) => room.title === newRoom
            );
            socket.emit("roomInfo", roomInfo);

            socket.on("disconnect", async () => {
              await fetchRoomOnlineUsers(io, namespace.href, newRoom);
            });
          });
        });
      });
    } catch (err) {
      console.log({ message: "Error On Socket Connection!!", err });
      socket.emit("error", {
        message: "Error On GetNamespaceeRooms Connection!!",
        err,
      });
    }
  });
};
