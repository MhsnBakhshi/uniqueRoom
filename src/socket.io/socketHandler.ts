import { Server } from "socket.io";
import { getNamespaceRooms, initConnection } from "./namespaces";
export default (io: Server) => {
  initConnection(io);
  getNamespaceRooms(io);
};
