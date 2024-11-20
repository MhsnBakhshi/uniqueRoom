import express, { Router } from "express";
import * as controller from "./auth.controller";

const router: Router = express.Router();

router.route("/send").post(controller.send);
router.route("/verify").post(controller.verify);

export default router;
