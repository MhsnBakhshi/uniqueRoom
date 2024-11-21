"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const socketConnection_1 = __importDefault(require("./configs/socketConnection"));
const socketHandler_1 = __importDefault(require("./socket.io/socketHandler"));
async function connectToDB() {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log(`Connect To MongoDB Successfully on host: ${mongoose_1.default.connection.host}`);
    }
    catch (error) {
        console.log(`Error On Coonection MongoDB: ${error}`);
        process.exit(1);
    }
}
async function startServer() {
    const port = +process.env.PORT || 4003;
    const httpServer = http_1.default.createServer(app_1.default);
    const io = (0, socketConnection_1.default)(httpServer);
    (0, socketHandler_1.default)(io);
    httpServer.listen(port, () => {
        console.log(`Server Runned Successfully On Port ${port}`);
    });
}
async function run() {
    await connectToDB();
    await startServer();
}
run();
