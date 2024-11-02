const express = require("express");
const authGaurd = require("../../middlewares/authGaurd");
const controller = require("./user.controller");
const router = express.Router();

router.route("/ban/:id").delete(authGaurd, controller.ban);

module.exports = router;
