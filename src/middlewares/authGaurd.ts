import User, { IUser } from "../models/User";
import { errorResponse } from "../utils/response";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface costomeUserRequest extends Request {
  user: IUser;
}
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "token not provided !!",
      });
      return;
    }

    const token: string[] = req.headers.authorization.split(" ");

    if (token[0] !== "Bearer") {
      errorResponse(res, StatusCodes.UNAUTHORIZED, {
        message: "only Bearer token is supported",
      });
      return;
    }

    const msinToken: string = token[1];

    const payloadedUser: JwtPayload = <JwtPayload>(
      jwt.verify(msinToken, process.env.JWT_SECRET_KEY!)
    );

    const user: IUser | null = await User.findOne({
      _id: payloadedUser.userId,
    });

    if (!user) {
      errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "User not found from this token",
      });
      return;
    }
    (req as costomeUserRequest).user = user;
    next();
  } catch (err) {
    next(err);
  }
};
