import express, { Router } from "express";
import authGaurd from "../../middlewares/authGaurd";
import * as controller from "./namespace.controller";
import { multerStorage } from "../../configs/multerConfigs";
import multer from "multer";

const router: Router = express.Router();

const uploader: multer.Multer = multerStorage("public/room/images");

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

export default router;
