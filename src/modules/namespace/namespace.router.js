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

router
  .route("/room/:roomId")
  .patch(authGaurd, uploader.single("media"), controller.editRoom)
  .delete(authGaurd, controller.delRoomProfile);

module.exports = router;
