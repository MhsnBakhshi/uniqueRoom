"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerStorage = void 0;
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const multerStorage = (destination, fileType = /jpg|png|jpeg/) => {
    if (!fs_1.default.existsSync(destination)) {
        fs_1.default.mkdirSync(destination, { recursive: true });
    }
    const storage = multer_1.default.diskStorage({
        destination: function (_, __, cb) {
            cb(null, destination);
        },
        filename: function (_, file, cb) {
            const imageFile = file.originalname.split(".");
            const extName = imageFile.pop();
            const fileName = imageFile.join(".");
            cb(null, `${fileName}-${Date.now()}.${extName}`);
        },
    });
    const fileFilter = function (req, file, cb) {
        if (fileType.test(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("File Type Is Not Allowed"));
        }
    };
    const upload = (0, multer_1.default)({
        storage,
        limits: {
            fileSize: 10 * 1024 * 1024, // 10 MB,
        },
        fileFilter,
    });
    return upload;
};
exports.multerStorage = multerStorage;
