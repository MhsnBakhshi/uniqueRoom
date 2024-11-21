import User, { IUser } from "../../models/User";
import Ban from "../../models/Ban";
import fs from "fs";
import path from "path";
import { StatusCodes } from "http-status-codes";
import { isValidObjectId } from "mongoose";
import { editUserInfoValidator } from "./user.validators";
import { errorResponse, successResponse } from "../../utils/response";
import { NextFunction, Request, Response } from "express";
import { costomeUserRequest } from "../../middlewares/authGaurd";

type EditUserType = { name?: string; email?: string; bio?: string };

export const ban = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(req as costomeUserRequest).user.roles?.includes("ADMIN")) {
      errorResponse(res, StatusCodes.FORBIDDEN, {
        message: "You have not access to use this rote",
      });
      return;
    }

    const { id } = req.params as { id: string };

    if (!isValidObjectId(id)) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "id is not valid",
      });
      return;
    }

    const deletedUser: IUser | null = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "user not found",
      });
      return;
    }

    await Ban.create({ phone: deletedUser.phone });

    successResponse(res, StatusCodes.OK, "User banned");
    return;
  } catch (err) {
    next(err);
  }
};

export const editProfileInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, bio } = req.body as EditUserType;

    const user: IUser | null = await User.findOne({
      _id: (req as costomeUserRequest).user._id,
    });

    await editUserInfoValidator.validate(
      { name, email, bio },
      { abortEarly: false }
    );

    if (!user) {
      errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "user not found",
      });
      return;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio || user.bio;

    await user.save();

    successResponse(res, StatusCodes.OK, { message: "User Updated." });
    return;
  } catch (err) {
    next(err);
  }
};

export const changeRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!(req as costomeUserRequest).user.roles?.includes("ADMIN")) {
      errorResponse(res, StatusCodes.FORBIDDEN, {
        message: "You have not access to use this rote",
      });
      return;
    }

    const { id } = req.params as { id: string };

    if (!isValidObjectId(id)) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "id is not valid",
      });
      return;
    }

    const user: IUser | null = await User.findById(id);

    if (user) {
      if (user.roles?.includes("USER")) {
        user.roles = ["ADMIN"];
      } else {
        user.roles = ["USER"];
      }
      await user.save();

      successResponse(res, StatusCodes.OK, { message: "role changed." });
      return;
    }

    errorResponse(res, StatusCodes.NOT_FOUND, {
      message: "User not found from this id",
    });
    return;
  } catch (err) {
    next(err);
  }
};

export const setProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as costomeUserRequest).user;

    if (!req.file) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "No File uploaded !!",
      });
      return;
    }

    const profilePath: string = `/profiles/${req.file.filename}`;

    await User.findByIdAndUpdate(user._id, {
      profile: profilePath,
    });

    successResponse(res, StatusCodes.OK, {
      message: "profile uploaded!!",
    });
    return;
  } catch (err) {
    next(err);
  }
};

exports.delProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: IUser | null = await User.findById(
      (req as costomeUserRequest).user._id
    );

    if (!user?.profile) {
      errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "User has not upoloaded profile yet !!",
      });
      return;
    }
    fs.unlinkSync(
      path.join(__dirname, "..", "..", "..", "/public", user?.profile)
    );

    user.profile = undefined;
    await user.save();
    successResponse(res, StatusCodes.OK, {
      message: "profile Deleted!!",
    });
    return;
  } catch (err) {
    next(err);
  }
};
