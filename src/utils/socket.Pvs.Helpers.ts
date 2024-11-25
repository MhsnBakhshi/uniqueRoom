import { Server, Socket } from "socket.io";
import PvModel, { IPv } from "../models/Pv";
import path from "path";
import fs from "fs";

interface INewMessageBody {
  content: string;
  sender: string;
  receiver: string;
}

interface IPvMediaBody {
  filename: string;
  file: string;
  sender: string;
  receiver: string;
}

interface IPvLocationBody {
  location: { x: number; y: number };
  sender: string;
  receiver: string;
}
export const createNewMessage = async (io: Server, socket: Socket) => {
  socket.on("newMessage", async (data) => {
    const { content, sender, receiver } = data as INewMessageBody;

    const messages = await PvModel.findOneAndUpdate(
      { sender, receiver },
      {
        $push: {
          messages: {
            sender,
            receiver,
            content,
          },
        },
      },
      { upsert: true }
    );
    io.of("/pv")
      .in(`${sender}-${receiver}`)
      .in(`${receiver}-${sender}`)
      .emit("confirmMessage", { ...data, messages });
  });
};

export const fetchAllPvMessages = async (io: Server, socket: Socket) => {
  socket.on("getAllMessage", async (data) => {
    const { sender, receiver } = data;

    const chat = await PvModel.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    })
      .populate("messages.sender", "name phone")
      .populate("messages.receiver", "name phone");

    socket.emit("allMessages", chat?.messages || []);
  });
};

export const removeMessageFromTwoWay = async (io: Server, socket: Socket) => {
  socket.on("removeMessage", async (data) => {
    const { messageId, sender, receiver } = data;

    if (!messageId || !sender || !receiver) {
      socket.emit("error", { message: "Invalid data provided for removal." });
      return;
    }

    const chat = await PvModel.findOneAndUpdate(
      {
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      },
      {
        $pull: {
          messages: { _id: messageId },
        },
      },
      { new: true }
    );

    if (!chat) {
      socket.emit("error", { message: "Chat not found." });
      return;
    }

    io.of("/pv")
      .in(`${sender}-${receiver}`)
      .in(`${receiver}-${sender}`)
      .emit("confirmRemoveMsg", { removed: true, messageId });
  });
};

export const uploadVoice = async (io: Server, socket: Socket) => {
  socket.on("newPvVoice", async (data: IPvMediaBody) => {
    const { filename, file, sender, receiver } = data;

    const pv: IPv | null = await PvModel.findOne({
      sender,
      receiver,
    });

    if (!pv) {
      socket.emit("error", {
        message: "pv not found from this sender and receiver",
      });
      return;
    }

    const allowedExtensions = [".mp3", ".wav", ".ogg"];
    const ext = path.extname(filename).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      socket.emit("error", {
        message: "Invalid file format for voice message!",
      });
      return;
    }

    const voicePath = `${path.join(__dirname, "../../public/pv/voice")}${String(
      Date.now() + ext
    )}`;

    fs.writeFile(voicePath, file, async (err) => {
      if (!err) {
        await PvModel.updateOne(
          {
            _id: pv._id,
            sender: pv.sender,
            receiver: pv.receiver,
          },
          {
            $push: {
              media: {
                sender,
                path: voicePath,
                type: "voice",
              },
            },
          }
        );
        io.of("/pv")
          .in(`${sender}-${receiver}`)
          .in(`${receiver}-${sender}`)
          .emit("confirmPvVoice", data);
      } else {
        console.error("Error On Uploading voice ->", err);
        return;
      }
    });
  });
};

export const uploadMedia = async (io: Server, socket: Socket) => {
  socket.on("newMedia", async (data: IPvMediaBody) => {
    const { filename, file, sender, receiver } = data;

    const pv: IPv | null = await PvModel.findOne({
      sender,
      receiver,
    });

    if (!pv) {
      socket.emit("error", {
        message: "pv not found from this sender and receiver",
      });
      return;
    }

    const ext = path.extname(filename);
    const mediaPath = `${path.join(
      __dirname,
      "../../public/pv/uploads"
    )}${String(Date.now() + ext)}`;

    fs.writeFile(mediaPath, file, async (err) => {
      if (!err) {
        await PvModel.updateOne(
          {
            _id: pv._id,
            sender: pv.sender,
            receiver: pv.receiver,
          },
          {
            $push: {
              media: {
                sender,
                path: mediaPath,
                type: "media",
              },
            },
          }
        );
        io.of("/pv")
          .in(`${sender}-${receiver}`)
          .in(`${receiver}-${sender}`)
          .emit("confirmPvVoice", data);
      } else {
        console.error("Error On Uploading media ->", err);
        return;
      }
    });
  });
};

export const uploadLocation = async (io: Server, socket: Socket) => {
  socket.on("newPvLocation", async (data: IPvLocationBody) => {
    const { location, receiver, sender } = data;

    const pv: IPv | null = await PvModel.findOne({
      sender,
      receiver,
    });

    if (!pv) {
      socket.emit("error", {
        message: "pv not found from this sender and receiver",
      });
      return;
    }

    await PvModel.updateOne(
      { _id: pv._id, sender, receiver },
      {
        $push: {
          locations: {
            sender,
            x: location.x,
            y: location.y,
          },
        },
      }
    );
    io.of("/pv")
      .in(`${sender}-${receiver}`)
      .in(`${receiver}-${sender}`)
      .emit("confirmPvLocation", data);
  });
};
