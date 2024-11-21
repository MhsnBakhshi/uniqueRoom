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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyValidatorSchema = exports.sendValidatorSchema = void 0;
const yup = __importStar(require("yup"));
exports.sendValidatorSchema = yup.object({
    phone: yup
        .string()
        .matches(/^(0|98)?([ ]|-|[()]){0,2}9[0-4|9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}$/, "شماره تلفن معتبر نمیباشد")
        .required("شماره تلفن اجباری است!"),
});
exports.verifyValidatorSchema = yup.object({
    phone: yup
        .string()
        .matches(/^(0|98)?([ ]|-|[()]){0,2}9[0-4|9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}$/, "شماره تلفن معتبر نمیباشد")
        .required("شماره تلفن اجباری است!"),
    otp: yup
        .string()
        .required("Otp code is required !!")
        .matches(/^[0-9]+$/, "Otp code is not valid !!")
        .max(6, "Otp should have 6 digit number"),
});
