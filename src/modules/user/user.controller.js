const { errorResponse, successResponse } = require("../../utils/response");
const User = require("../../models/User");
const Ban = require("../../models/Ban");
const fs = require("fs");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const { isValidObjectId } = require("mongoose");
const { editUserInfoValidator } = require("./user.validators");

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

exports.editProfileInfo = async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    const user = await User.findOne({ _id: req.user._id });

    await editUserInfoValidator.validate(
      { name, email, bio },
      { abortEarly: false }
    );

    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio || user.bio;

    await user.save();

    return successResponse(res, StatusCodes.OK, { message: "User Updated." });
  } catch (err) {
    next(err);
  }
};

exports.changeRole = async (req, res, next) => {
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

    const user = await User.findById(id);

    if (user) {
      if (user.roles.includes("USER")) {
        user.roles = ["ADMIN"];
      } else {
        user.roles = ["USER"];
      }
      await user.save();

      return successResponse(res, StatusCodes.OK, { message: "role changed." });
    }

    return errorResponse(res, StatusCodes.NOT_FOUND, {
      message: "User not found from this id",
    });
  } catch (err) {
    next(err);
  }
};

exports.setProfile = async (req, res, next) => {
  try {
    const user = req.user;

    if (!req.file) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "No File uploaded !!",
      });
    }

    const profilePath = `/profiles/${req.file.filename}`;

    await User.findByIdAndUpdate(user._id, {
      profile: profilePath,
    });

    return successResponse(res, StatusCodes.OK, {
      message: "profile uploaded!!",
    });
  } catch (err) {
    next(err);
  }
};

exports.delProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.profile) {
      return errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "User has not upoloaded profile yet !!",
      });
    }
    fs.unlinkSync(
      path.join(__dirname, "..", "..", "..", "/public", user.profile),
      (err) => next(err)
    );

    user.profile = undefined;
    await user.save();
    return successResponse(res, StatusCodes.OK, {
      message: "profile Deleted!!",
    });
  } catch (err) {
    next(err);
  }
};
