const User = require("../models/User");
const { errorResponse } = require("../utils/response");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "token not provided !!",
      });
    }
    
    const token = req.headers.authorization.split(" ");

    if (token[0] !== "Bearer") {
      return errorResponse(res, StatusCodes.UNAUTHORIZED, {
        message: "only Bearer token is supported",
      });
    }

    const msinToken = token[1];

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
