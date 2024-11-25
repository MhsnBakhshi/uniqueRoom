import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { errorResponse, successResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import UserModel from "../../models/User";
import PvModel, { IPv } from "../../models/Pv";
import { costomeUserRequest } from "../../middlewares/authGaurd";

interface IAddPvBody {
  receiver: string;
  isBlocked?: boolean;
  isPinned?: boolean;
}
interface IDetialsBody {
  id: string;
  isBlocked?: boolean;
  isPinned?: boolean;
}
export const add = async (
  req: Request<{}, {}, IAddPvBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { receiver, isBlocked, isPinned } = req.body;
    const user = (req as costomeUserRequest).user;

    if (!isValidObjectId(receiver)) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "receiver is not valid id",
      });
      return;
    }

    const isExistReceiver: boolean = !!(await UserModel.findOne({
      _id: receiver,
    }));

    if (!isExistReceiver) {
      errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "receiver not found check id",
      });
      return;
    }

    const newPv = await PvModel.create({
      sender: user._id,
      receiver,
      isBlocked,
      isPinned,
    });

    successResponse(res, StatusCodes.CREATED, {
      message: "Pv created successfully",
      data: newPv,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as { id: string };

    if (!isValidObjectId(id)) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "id not valid ObjectId!!",
      });
      return;
    }

    const pv: IPv | null = await PvModel.findOneAndDelete({ _id: id });

    if (!pv) {
      errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "pv not found!!",
      });
      return;
    }

    successResponse(res, StatusCodes.OK, { message: "Pv deleted." });
    return;
  } catch (error) {
    next(error);
  }
};

export const upgradeDetails = async (
  req: Request<{}, {}, IDetialsBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, isBlocked, isPinned } = req.body;

    if (!isValidObjectId(id)) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "id not valid ObjectId!!",
      });
      return;
    }

    const pv: IPv | null = await PvModel.findOne({ _id: id });

    if (!pv) {
      errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "pv not found!!",
      });
      return;
    }

    pv.isBlocked = isBlocked || pv.isBlocked;
    pv.isPinned = isPinned || pv.isPinned;

    await pv.save();

    successResponse(res, StatusCodes.OK, {
      message: "pv updated successfully",
    });
    return;
  } catch (error) {
    next(error);
  }
};
