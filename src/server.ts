import mongoose from "mongoose";
import app from "./app";
import http from "http";
import socketConnection from "./configs/socketConnection";
import socketHandler from "./socket.io/socketHandler";

async function connectToDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log(
      `Connect To MongoDB Successfully on host: ${mongoose.connection.host}`
    );
  } catch (error) {
    console.log(`Error On Coonection MongoDB: ${error}`);
    process.exit(1);
  }
}

async function startServer(): Promise<void> {
  const port: number = +process.env.PORT! || 4003;
  const httpServer = http.createServer(app);
  const io = socketConnection(httpServer);
  socketHandler(io);

  httpServer.listen(port, () => {
    console.log(`Server Runned Successfully On Port ${port}`);
  });
}

async function run(): Promise<void> {
  await connectToDB();
  await startServer();
}

run();
