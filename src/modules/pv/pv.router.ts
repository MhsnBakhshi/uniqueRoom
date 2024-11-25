import express, { Router } from "express";
import authGaurd from "../../middlewares/authGaurd";
import * as controller from "./pv.controller";

const router: Router = express.Router();

router.route("/add").post(authGaurd, controller.add);
router.route("/remove/:id").delete(authGaurd, controller.remove);

router.route("/upgrade-details").patch(authGaurd, controller.upgradeDetails);

export default router;
