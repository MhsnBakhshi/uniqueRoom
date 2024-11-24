import mongoose from "mongoose";
import app from "./app";
import http from "http";
import socketConnection from "./configs/socketConnection";
import socketHandler from "./socket.io/socketHandler";
import socketAuthGaurd from "./middlewares/socketAuthGaurd";
import { redis } from "./configs/redisConnection";

async function connectToDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log(
      `Connect To MongoDB Successfully on host: ${mongoose.connection.host}`
    );
    await redis.ping();
  } catch (error) {
    console.log(`Error On Coonection MongoDB: ${error}`);
    await mongoose.disconnect();
    redis.disconnect();
    process.exit(1);
  }
}

async function startServer(): Promise<void> {
  const port: number = +process.env.PORT! || 4003;
  const httpServer = http.createServer(app);
  const io = socketConnection(httpServer);
  io.use(socketAuthGaurd);
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
