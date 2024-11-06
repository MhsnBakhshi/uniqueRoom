const express = require("express");
const authGaurd = require("../../middlewares/authGaurd");
const controller = require("./contact.controller");

const router = express.Router();

router.route("/add").post(authGaurd, controller.add);

module.exports = router;
