import Namespace, { INamespace, IRooms } from "../../models/Namespace";
import { StatusCodes } from "http-status-codes";
import fs from "fs";
import path from "path";
import { errorResponse, successResponse } from "../../utils/response";
import { createNamespaceValidator } from "./namespace.validators";
import { isValidObjectId } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { costomeUserRequest } from "../../middlewares/authGaurd";
import UserModel, { IUser } from "../../models/User";

interface ICreateBody {
  title: string;
  creator: string;
  href: string;
}

interface IMongoIDParam {
  roomId: string;
}
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const namespaces: INamespace[] = await Namespace.find({}).sort({ _id: -1 });

    if (!namespaces.length) {
      errorResponse(res, StatusCodes.NOT_FOUND, {
        messeage: "The namespace list is emtity..",
      });
      return;
    } else {
      successResponse(res, StatusCodes.OK, namespaces);
      return;
    }
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request<{}, {}, ICreateBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, href, creator } = req.body;
    const user = (req as costomeUserRequest).user;
    await createNamespaceValidator.validate(
      { title, href, creator },
      { abortEarly: false }
    );

    const isExistNamespace: INamespace | null = await Namespace.findOne({
      $or: [{ title }, { href }],
    });

    if (isExistNamespace) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "The namespace alredy exist fromthis info",
      });
      return;
    }

    if (!isValidObjectId(creator)) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        messeage: "Creator Is Not ObjectId !!",
      });
      return;
    }

    const isExistUser: IUser | null = await UserModel.findOne({ _id: creator });

    if (!isExistUser) {
      errorResponse(res, StatusCodes.NOT_FOUND, {
        messeage: "There Is No User From Creator Id U Sent !!",
      });
      return;
    }

    const namespace = await Namespace.create({
      title,
      href,
      creator: user._id,
    });

    successResponse(res, StatusCodes.CREATED, {
      message: "namespace created",
      namespace,
    });
    return;
  } catch (err) {
    next(err);
  }
};

export const createRoom = async (
  req: Request<{}, {}, ICreateBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, href } = req.body;
    let profile: any = undefined;

    const existingNamespace = await Namespace.findOne({
      href,
    }).lean();

    if (!existingNamespace) {
      errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "There is no namespace from this href!",
      });
      return;
    }
    const existingRoom = await Namespace.findOne({
      "rooms.title": title,
    }).lean();

    if (existingRoom) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "There is room from this title",
      });
      return;
    }
    if (req.file) {
      profile = `/room/images/${req.file.filename}`;
    }

    const newRoom = {
      title,
      image: profile ? profile : undefined,
    };

    await Namespace.findOneAndUpdate(
      { href },
      {
        $push: {
          rooms: newRoom,
        },
      }
    );

    successResponse(res, StatusCodes.OK, { message: "Room created." });
    return;
  } catch (err) {
    next(err);
  }
};

export const delRoomProfile = async (
  req: Request<IMongoIDParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { roomId } = req.params;

    if (!isValidObjectId(roomId)) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "roomId is not valid",
      });
      return;
    }

    let existingRoom: INamespace | null = await Namespace.findOne({
      "rooms._id": roomId,
    });

    if (!existingRoom) {
      errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "there is no room from this id",
      });
      return;
    }

    let room = existingRoom?.rooms?.id(roomId);

    if (room && room.image) {
      fs.unlink(
        path.join(__dirname, "..", "..", "..", "/public", room.image),
        (err) => next(err)
      );

      room.image = undefined;
      await existingRoom.save();

      successResponse(res, StatusCodes.OK, {
        message: "Profile room deleted.",
      });
      return;
    }

    errorResponse(res, StatusCodes.BAD_REQUEST, {
      message: "room havent profile yet!!",
    });
    return;
  } catch (err) {
    next(err);
  }
};

export const editRoom = async (
  req: Request<IMongoIDParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { roomId } = req.params;
    const { title } = req.body as { title: string };

    if (!isValidObjectId(roomId)) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "roomId is not valid",
      });
      return;
    }

    let existingRoom = await Namespace.findOne({ "rooms._id": roomId });

    if (!existingRoom) {
      errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "there is no room from this id",
      });
      return;
    }

    let room: IRooms | null | undefined = existingRoom?.rooms?.id(roomId);

    room!.title = title || room!.title;

    if (req.file) {
      try {
        fs.unlinkSync(
          path.join(__dirname, "..", "..", "..", "/public", <string>room?.image)
        );
      } catch (unlinkErr) {
        next(unlinkErr);
      }

      room!.image = `/room/images/${req.file.filename}`;
    }

    await existingRoom.save();

    successResponse(res, StatusCodes.OK, {
      message: "room info edited",
    });
    return;
  } catch (err) {
    next(err);
  }
};
