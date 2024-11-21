"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authGaurd_1 = __importDefault(require("../../middlewares/authGaurd"));
const controller = __importStar(require("./user.controller"));
const multerConfigs_1 = require("../../configs/multerConfigs");
const router = express_1.default.Router();
const uploader = (0, multerConfigs_1.multerStorage)("public/profiles");
router.route("/edit").patch(authGaurd_1.default, controller.editProfileInfo);
router.route("/ban/:id").delete(authGaurd_1.default, controller.ban);
router.route("/change-role/:id").put(authGaurd_1.default, controller.changeRole);
router
    .route("/profile")
    .post(authGaurd_1.default, uploader.single("profile"), controller.setProfile)
    .delete(authGaurd_1.default, controller.delProfile);
exports.default = router;
