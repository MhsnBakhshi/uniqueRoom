import { Server } from "socket.io";
import { getNamespaceRooms, initConnection } from "./namespaces";
import { sendPvsDetails } from "./pv";
export default (io: Server) => {
  initConnection(io);
  sendPvsDetails(io);
  getNamespaceRooms(io);
};
