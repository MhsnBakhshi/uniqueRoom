const express = require("express");
const controller = require("./auth.controller");
const router = express.Router();

router.route("/send").post(controller.send);
router.route("/verify").post(controller.verify);

module.exports = router;
