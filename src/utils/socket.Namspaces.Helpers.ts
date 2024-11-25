import { Server, Socket } from "socket.io";
import NamespaceModel, { INamespace } from "../models/Namespace";
import PvModel, { IPv } from "../models/Pv";
import UserModel, { IUser } from "../models/User";
import path from "path";
import fs from "fs";

export interface IMessageBody {
  sender: string;
  content: string;
  roomName: string;
}
export interface ILocationBody {
  sender: string;
  location: { x: number; y: number };
  roomName: string;
}
export interface IMediaBody {
  filename: string;
  file: any;
  sender: string;
  roomName: string;
}

export interface IIsTypingBody {
  userID: string;
  roomName: string;
  isTyping: boolean;
}

export const fetchNamespaces = async (
  userId: string
): Promise<INamespace[]> => {
  try {
    const namespaces: INamespace[] | null = await NamespaceModel.find({
      creator: userId,
    }).sort({
      _id: -1,
    });
    return namespaces;
  } catch (error) {
    console.log("Error On Fetching Namespaces From DB", error);
    return [];
  }
};
export const fetchPvs = async (userId: string): Promise<IPv[]> => {
  try {
    const pvs: IPv[] | null = await PvModel.find({
      $or: [{ receiver: userId }, { sender: userId }],
    }).sort({
      _id: -1,
    });
    return pvs;
  } catch (error) {
    console.log("Error On Fetching Pvs From DB", error);
    return [];
  }
};

export const fetchMessage = async (io: Server, socket: Socket) => {
  socket.on("newMessage", async (data: IMessageBody) => {
    const { content, sender, roomName } = data;

    const namespace: INamespace | null = await NamespaceModel.findOne({
      "rooms.title": roomName,
    });

    if (!namespace) {
      console.log({ message: "Namespace Not Found !!" });
      socket.emit("error", { message: "Namespace Not Found !!" });
      return;
    }

    await NamespaceModel.updateOne(
      {
        _id: namespace._id,
        "rooms.title": roomName,
      },
      {
        $push: {
          "rooms.$.messages": {
            sender,
            content,
          },
        },
      }
    );
    io.of(namespace.href).in(roomName).emit("confirmMessage", data);
  });
  isTyping(io, socket);
};

export const fetchLocation = async (io: Server, socket: Socket) => {
  socket.on("location", async (data: ILocationBody) => {
    const { location, roomName, sender } = data;

    const namespace: INamespace | null = await NamespaceModel.findOne({
      "rooms.title": roomName,
    });
    if (!namespace) {
      console.log({ message: "Namespace Not Found !!" });
      socket.emit("error", { message: "Namespace Not Found !!" });
      return;
    }

    await NamespaceModel.updateOne(
      { _id: namespace._id, "rooms.title": roomName },
      {
        $push: {
          "rooms.$locations": {
            sender,
            x: location.x,
            y: location.y,
          },
        },
      }
    );
    io.of(namespace.href).in(roomName).emit("confirmLocations", data);
  });
};

export const fetchMedia = async (io: Server, socket: Socket) => {
  socket.on("newMedia", async (data: IMediaBody) => {
    const { filename, file, sender, roomName } = data;

    const namespace: INamespace | null = await NamespaceModel.findOne({
      "rooms.title": roomName,
    });

    const ext = path.extname(filename);
    const mediaPath = `${path.join(
      __dirname,
      "../../public/room/uploads"
    )}${String(Date.now() + ext)}`;

    fs.writeFile(mediaPath, file, async (err) => {
      if (!err) {
        await NamespaceModel.updateOne(
          {
            _id: namespace?._id,
            "rooms.title": roomName,
          },
          {
            $push: {
              "rooms.$.media": {
                sender,
                path: mediaPath,
                type: "media",
              },
            },
          }
        );
        io.of(namespace!.href).in(roomName).emit("confirmMedia", data);
      } else {
        console.error("Error On Uploading media ->", err);
        return;
      }
    });
  });
};

export const fetchVoice = async (io: Server, socket: Socket) => {
  socket.on("newVoice", async (data: IMediaBody) => {
    const { filename, file, sender, roomName } = data;

    const namespace: INamespace | null = await NamespaceModel.findOne({
      "rooms.title": roomName,
    });
    const allowedExtensions = [".mp3", ".wav", ".ogg"];
    const ext = path.extname(filename).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      socket.emit("error", {
        message: "Invalid file format for voice message!",
      });
      return;
    }

    const voicePath = `${path.join(
      __dirname,
      "../../public/room/voice"
    )}${String(Date.now() + ext)}`;

    fs.writeFile(voicePath, file, async (err) => {
      if (!err) {
        await NamespaceModel.updateOne(
          {
            _id: namespace?._id,
            "rooms.title": roomName,
          },
          {
            $push: {
              "rooms.$.media": {
                sender,
                path: voicePath,
                type: "voice",
              },
            },
          }
        );
        io.of(namespace!.href).in(roomName).emit("confirmVoice", data);
      } else {
        console.error("Error On Uploading voice ->", err);
        return;
      }
    });
  });
};

export const fetchRoomOnlineUsers = async (
  io: Server,
  href: string,
  roomName: string
) => {
  const onlineUsers = await io.of(href).in(roomName).allSockets();

  io.of(href)
    .in(roomName)
    .emit("onlineUsersCount", Array.from(onlineUsers).length);
};

export const isTyping = async (io: Server, socket: Socket) => {
  socket.on("isTyping", async (data) => {
    const { userID, roomName, isTyping } = data as IIsTypingBody;

    const namespace: INamespace | null = await NamespaceModel.findOne({
      "rooms.title": roomName,
    });

    const user: IUser | null = await UserModel.findOne({ _id: userID });

    if (!namespace) {
      console.log({ message: "Namespace Not Found !!" });
      socket.emit("error", { message: "Namespace Not Found !!" });
      return;
    }
    if (!user) {
      console.log({ message: "User Not Found !!" });
      socket.emit("error", { message: "User Not Found !!" });
      return;
    }

    io.of(namespace.href)
      .in(roomName)
      .emit("isTyping", { isTyping, user: user.name || user.phone });

    if (!isTyping) {
      await fetchRoomOnlineUsers(io, namespace.href, roomName);
    }
  });
};
