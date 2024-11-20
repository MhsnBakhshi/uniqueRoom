import fs from "fs";
import multer, { StorageEngine } from "multer";
import { Request } from "express";

export const multerStorage = (
  destination: string,
  fileType: RegExp = /jpg|png|jpeg/
): multer.Multer => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const storage: StorageEngine = multer.diskStorage({
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

  const fileFilter = function (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) {
    if (fileType.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File Type Is Not Allowed"));
    }
  };

  const upload = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB,
    },
    fileFilter,
  });

  return upload;
};
