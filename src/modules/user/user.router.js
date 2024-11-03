const express = require("express");
const authGaurd = require("../../middlewares/authGaurd");
const controller = require("./user.controller");
const router = express.Router();

router.route("/edit").patch(authGaurd, controller.editProfileInfo);

router.route("/ban/:id").delete(authGaurd, controller.ban);

router.route("/change-role/:id").put(authGaurd, controller.changeRole);

module.exports = router;
