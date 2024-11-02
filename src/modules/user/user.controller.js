const { errorResponse, successResponse } = require("../../utils/response");
const User = require("../../models/User");
const Ban = require("../../models/Ban");
const { StatusCodes } = require("http-status-codes");
const { isValidObjectId } = require("mongoose");

exports.ban = async (req, res, next) => {
  try {
    if (!req.user.roles.includes("ADMIN")) {
      return errorResponse(res, StatusCodes.FORBIDDEN, {
        message: "You have not access to use this rote",
      });
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "id is not valid",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "user not found",
      });
    }

    await Ban.create({ phone: deletedUser.phone });

    return successResponse(res, StatusCodes.OK, "User banned");
  } catch (err) {
    next(err);
  }
};
