import express, { Router } from "express";
import authGaurd from "../../middlewares/authGaurd";
import * as controller from "./contact.controller";

const router: Router = express.Router();

router.route("/add").post(authGaurd, controller.add);

export default router;
