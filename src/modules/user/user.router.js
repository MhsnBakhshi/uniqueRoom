const express = require("express");
const authGaurd = require("../../middlewares/authGaurd");
const controller = require("./user.controller");
const { multerStorage } = require("../../configs/multerConfigs");
const router = express.Router();

const uploader = multerStorage("public/profiles");

router.route("/edit").patch(authGaurd, controller.editProfileInfo);

router.route("/ban/:id").delete(authGaurd, controller.ban);

router.route("/change-role/:id").put(authGaurd, controller.changeRole);

router
  .route("/profile")
  .post(authGaurd, uploader.single("profile"), controller.setProfile)
  .delete(authGaurd, controller.delProfile);

module.exports = router;
