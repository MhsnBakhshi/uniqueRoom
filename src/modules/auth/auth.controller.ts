import { sendValidatorSchema, verifyValidatorSchema } from "./auth.validator";
import { errorResponse, successResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import Ban, { IBan } from "../../models/Ban";
import User, { IUser } from "../../models/User";
import {
  getOtpDetails,
  generateOtpCode,
  sendSMS,
  cachOtpFromRedis,
  generateToken,
} from "../../utils/helper";
import { NextFunction, Request, Response } from "express";

interface ISendBody {
  phone: string;
}
interface IVerifyBody {
  phone: string;
  otp: number;
}

export const send = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body as ISendBody;
    await sendValidatorSchema.validate({ phone }, { abortEarly: false });

    const isBanned: IBan | null = await Ban.findOne({ phone });

    if (isBanned) {
      errorResponse(res, StatusCodes.FORBIDDEN, "You are already banned !!");
      return;
    }
    const { expired, remainingTime } = await getOtpDetails(phone);

    if (!expired) {
      successResponse(res, StatusCodes.OK, {
        message: `Otp already sent in your phone, please try agian in: ${remainingTime}`,
      });
      return;
    }

    const otp: number = await generateOtpCode(phone, 4);

    // sendSMS(phone, otp);

    successResponse(res, StatusCodes.OK, {
      message: "Otp sent successfully.",
    });
    return;
  } catch (err) {
    next(err);
  }
};

export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, otp } = req.body as IVerifyBody;
    await verifyValidatorSchema.validate({ phone, otp }, { abortEarly: false });

    const mainOtp = await cachOtpFromRedis(phone);

    if (!mainOtp) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "Otp expired or wrong !!",
      });
      return;
    }

    if (+mainOtp !== +otp) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "Otp is not correct !!",
      });
      return;
    }

    const existUser: IUser | null = await User.findOne({ phone });

    if (existUser) {
      successResponse(res, StatusCodes.OK, {
        user: existUser,
        token: generateToken(existUser._id),
      });
      return;
    }
    const isFirstUser: boolean = (await User.countDocuments()) === 2;

    const user: IUser = await User.create({
      phone,
      roles: isFirstUser ? ["ADMIN"] : ["USER"],
    });

    successResponse(res, StatusCodes.OK, {
      message: "User registed successfully :))",
      user,
      token: generateToken(user._id),
    });
    return;
  } catch (err) {
    next(err);
  }
};
