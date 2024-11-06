const express = require("express");
const authGaurd = require("../../middlewares/authGaurd");
const controller = require("./namespace.controller");
const { multerStorage } = require("../../configs/multerConfigs");
const router = express.Router();

const uploader = multerStorage("public/room/images");

router
  .route("/")
  .get(authGaurd, controller.getAll)
  .post(authGaurd, controller.create);

router
  .route("/room")
  .post(authGaurd, uploader.single("media"), controller.createRoom);
module.exports = router;
