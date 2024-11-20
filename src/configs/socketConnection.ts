import { Server as HTTPServer } from "http";
import { Server } from "socket.io";

export default (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  return io;
};
