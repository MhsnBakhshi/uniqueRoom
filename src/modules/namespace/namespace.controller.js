const Namespace = require("../../models/Namespace");
const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const path = require("path");
const { errorResponse, successResponse } = require("../../utils/response");
const { createNamespaceValidator } = require("./namespace.validators");
const { isValidObjectId } = require("mongoose");

exports.getAll = async (req, res, next) => {
  try {
    const namespaces = await Namespace.find({}).sort({ _id: -1 });

    if (!namespaces.length) {
      return errorResponse(res, StatusCodes.NOT_FOUND, {
        messeage: "The namespace list is emtity..",
      });
    } else {
      return successResponse(res, StatusCodes.OK, namespaces);
    }
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, href } = req.body;

    await createNamespaceValidator.validate(
      { title, href },
      { abortEarly: false }
    );

    const isExistNamespace = await Namespace.findOne({
      $or: [{ title }, { href }],
    });

    if (isExistNamespace) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "The namespace alredy exist fromthis info",
      });
    }

    const namespace = await Namespace.create({ title, href });

    return successResponse(res, StatusCodes.CREATED, {
      message: "namespace created",
      namespace,
    });
  } catch (err) {
    next(err);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const { title, href } = req.body;
    let profile = undefined;

    const existingNamespace = await Namespace.findOne({ href }).lean();

    if (!existingNamespace) {
      return errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "There is no namespace from this href!",
      });
    }
    const existingRoom = await Namespace.findOne({
      "rooms.title": title,
    }).lean();

    if (existingRoom) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "There is room from this title",
      });
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

    return successResponse(res, StatusCodes.OK, { message: "Room created." });
  } catch (err) {
    next(err);
  }
};

exports.delRoomProfile = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    if (!isValidObjectId(roomId)) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "roomId is not valid",
      });
    }

    let existingRoom = await Namespace.findOne({ "rooms._id": roomId });

    if (!existingRoom) {
      return errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "there is no room from this id",
      });
    }

    let room = existingRoom.rooms.id(roomId);

    if (room && room.image) {
      fs.unlink(
        path.join(__dirname, "..", "..", "..", "/public", room.image),
        (err) => next(err)
      );

      room.image = undefined;
      await existingRoom.save();

      return successResponse(res, StatusCodes.OK, {
        message: "Profile room deleted.",
      });
    }

    return errorResponse(res, StatusCodes.BAD_REQUEST, {
      message: "room havent profile yet!!",
    });
  } catch (err) {
    next(err);
  }
};

exports.editRoom = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
