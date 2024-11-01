const {
  sendValidatorSchema,
  verifyValidatorSchema,
} = require("./auth.validator");
const { errorResponse, successResponse } = require("../../utils/response");
const { StatusCodes } = require("http-status-codes");
const Ban = require("../../models/Ban");
const User = require("../../models/User");
const {
  getOtpDetails,
  generateOtpCode,
  sendSMS,
  cachOtpFromRedis,
  generateToken,
} = require("../../utils/helper");

exports.send = async (req, res, next) => {
  try {
    const { phone } = req.body;
    await sendValidatorSchema.validate({ phone }, { abortEarly: false });

    const isBanned = await Ban.findOne({ phone });

    if (isBanned) {
      return errorResponse(
        res,
        StatusCodes.FORBIDDEN,
        "You are already banned !!"
      );
    }
    const { expired, remainingTime } = await getOtpDetails(phone);

    if (!expired) {
      return successResponse(res, StatusCodes.OK, {
        message: `Otp already sent in your phone, please try agian in: ${remainingTime}`,
      });
    }

    const otp = await generateOtpCode(phone, 4);

    // sendSMS(phone, otp);

    return successResponse(res, StatusCodes.OK, {
      message: "Otp sent successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    await verifyValidatorSchema.validate({ phone, otp }, { abortEarly: false });

    const mainOtp = await cachOtpFromRedis(phone);

    if (!mainOtp) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "Otp expired or wrong !!",
      });
    }

    if (+mainOtp !== +otp) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "Otp is not correct !!",
      });
    }

    const existUser = await User.findOne({ phone });

    if (existUser) {
      return successResponse(res, StatusCodes.OK, {
        user: existUser,
        token: generateToken(existUser._id),
      });
    }
    const isFirstUser = (await User.countDocuments()) === 0;

    const user = await User.create({
      phone,
      roles: isFirstUser ? ["ADMIN"] : ["USER"],
    });

    return successResponse(res, StatusCodes.OK, {
      message: "User registed successfully :))",
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};


