import User from "../models/User";
import { errorResponse } from "../utils/response";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "token not provided !!",
      });
    }

    const token: string[] = req.headers.authorization.split(" ");

    if (token[0] !== "Bearer") {
      return errorResponse(res, StatusCodes.UNAUTHORIZED, {
        message: "only Bearer token is supported",
      });
    }

    const msinToken: string = token[1];

    const payloadedUser = jwt.verify(msinToken, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ _id: payloadedUser.userId });

    if (!user) {
      return errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "User not found from this token",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
