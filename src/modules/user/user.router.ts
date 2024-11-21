import express, { Router } from "express";
import authGaurd from "../../middlewares/authGaurd";
import * as controller from "./user.controller";
import { multerStorage } from "../../configs/multerConfigs";
import multer from "multer";

const router: Router = express.Router();
const uploader: multer.Multer = multerStorage("public/profiles");

router.route("/edit").patch(authGaurd, controller.editProfileInfo);

router.route("/ban/:id").delete(authGaurd, controller.ban);

router.route("/change-role/:id").put(authGaurd, controller.changeRole);

router
  .route("/profile")
  .post(authGaurd, uploader.single("profile"), controller.setProfile)
  .delete(authGaurd, controller.delProfile);

export default router;
