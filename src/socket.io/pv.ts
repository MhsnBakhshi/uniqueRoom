import { Server } from "socket.io";
import {
  fetchAllPvMessages,
  createNewMessage,
  removeMessageFromTwoWay,
  uploadVoice,
  uploadLocation,
  uploadMedia,
} from "../utils/socket.Pvs.Helpers";

export const sendPvsDetails = async (io: Server) => {
  io.of("/pv").on("connection", async (socket) => {
    await fetchAllPvMessages(io, socket);
    await createNewMessage(io, socket);

    await uploadVoice(io, socket);
    await uploadLocation(io, socket);
    await uploadMedia(io, socket);

    await removeMessageFromTwoWay(io, socket);
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
