const mongoose = require("mongoose");
const app = require("./app");
const http = require("http");
const socketConnection = require("./configs/socketConnection");
const socketHandler = require("./socket.io/socketHandler");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Connect To MongoDB Successfully on host: ${mongoose.connection.host}`
    );
  } catch (error) {
    console.log(`Error On Coonection MongoDB: ${error}`);
    process.exit(1);
  }
}

async function startServer() {
  const port = process.env.PORT || 4003;
  const httpServer = http.createServer(app);
  const io = socketConnection(httpServer);
  socketHandler(io);

  httpServer.listen(port, () => {
    console.log(`Server Runned Successfully On Port ${port}`);
  });
}

async function run() {
  await connectToDB();
  await startServer();
}

run();
