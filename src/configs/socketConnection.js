const socketIO = require("socket.io");

module.exports = (httpServer) => {
  const io = socketIO(httpServer, {
    cors: {
      origin: "*",
    },
  });

  return io;
};
