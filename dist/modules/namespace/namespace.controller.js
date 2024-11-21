"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editRoom = exports.delRoomProfile = exports.createRoom = exports.create = exports.getAll = void 0;
const Namespace_1 = __importDefault(require("../../models/Namespace"));
const http_status_codes_1 = require("http-status-codes");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const response_1 = require("../../utils/response");
const namespace_validators_1 = require("./namespace.validators");
const mongoose_1 = require("mongoose");
const getAll = async (req, res, next) => {
    try {
        const namespaces = await Namespace_1.default.find({}).sort({ _id: -1 });
        if (!namespaces.length) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                messeage: "The namespace list is emtity..",
            });
            return;
        }
        else {
            (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, namespaces);
            return;
        }
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const create = async (req, res, next) => {
    try {
        const { title, href } = req.body;
        await namespace_validators_1.createNamespaceValidator.validate({ title, href }, { abortEarly: false });
        const isExistNamespace = await Namespace_1.default.findOne({
            $or: [{ title }, { href }],
        });
        if (isExistNamespace) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "The namespace alredy exist fromthis info",
            });
            return;
        }
        const namespace = await Namespace_1.default.create({ title, href });
        (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.CREATED, {
            message: "namespace created",
            namespace,
        });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const createRoom = async (req, res, next) => {
    try {
        const { title, href } = req.body;
        let profile = undefined;
        const existingNamespace = await Namespace_1.default.findOne({
            href,
        }).lean();
        if (!existingNamespace) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "There is no namespace from this href!",
            });
            return;
        }
        const existingRoom = await Namespace_1.default.findOne({
            "rooms.title": title,
        }).lean();
        if (existingRoom) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "There is room from this title",
            });
            return;
        }
        if (req.file) {
            profile = `/room/images/${req.file.filename}`;
        }
        const newRoom = {
            title,
            image: profile ? profile : undefined,
        };
        await Namespace_1.default.findOneAndUpdate({ href }, {
            $push: {
                rooms: newRoom,
            },
        });
        (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, { message: "Room created." });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.createRoom = createRoom;
const delRoomProfile = async (req, res, next) => {
    var _a;
    try {
        const { roomId } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(roomId)) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "roomId is not valid",
            });
            return;
        }
        let existingRoom = await Namespace_1.default.findOne({
            "rooms._id": roomId,
        });
        if (!existingRoom) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "there is no room from this id",
            });
            return;
        }
        let room = (_a = existingRoom === null || existingRoom === void 0 ? void 0 : existingRoom.rooms) === null || _a === void 0 ? void 0 : _a.id(roomId);
        if (room && room.image) {
            fs_1.default.unlink(path_1.default.join(__dirname, "..", "..", "..", "/public", room.image), (err) => next(err));
            room.image = undefined;
            await existingRoom.save();
            (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, {
                message: "Profile room deleted.",
            });
            return;
        }
        (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            message: "room havent profile yet!!",
        });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.delRoomProfile = delRoomProfile;
const editRoom = async (req, res, next) => {
    var _a;
    try {
        const { roomId } = req.params;
        const { title } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(roomId)) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "roomId is not valid",
            });
            return;
        }
        let existingRoom = await Namespace_1.default.findOne({ "rooms._id": roomId });
        if (!existingRoom) {
            (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "there is no room from this id",
            });
            return;
        }
        let room = (_a = existingRoom === null || existingRoom === void 0 ? void 0 : existingRoom.rooms) === null || _a === void 0 ? void 0 : _a.id(roomId);
        room.title = title || room.title;
        if (req.file) {
            try {
                fs_1.default.unlinkSync(path_1.default.join(__dirname, "..", "..", "..", "/public", room === null || room === void 0 ? void 0 : room.image));
            }
            catch (unlinkErr) {
                next(unlinkErr);
            }
            room.image = `/room/images/${req.file.filename}`;
        }
        await existingRoom.save();
        (0, response_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, {
            message: "room info edited",
        });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.editRoom = editRoom;
