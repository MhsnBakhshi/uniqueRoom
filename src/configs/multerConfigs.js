const fs = require("fs");
const path = require("path");
const multer = require("multer");
exports.multerStorage = (destination, fileType = /jpg|png|jpeg/) => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const storage = multer.diskStorage({
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
    } else {
      cb(new Error("File Type Is Not Allowed"));
    }
  };

  const upload = multer({
    storage,
    limits: {
      fileSize: 512_000_000,
    },
    fileFilter,
  });

  return upload;
};
