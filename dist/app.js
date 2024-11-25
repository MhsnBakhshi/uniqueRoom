"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const http_status_codes_1 = require("http-status-codes");
const headers_1 = require("./middlewares/headers");
const errHandler_1 = require("./middlewares/errHandler");
const response_1 = require("./utils/response");
const auth_router_1 = __importDefault(require("./modules/auth/auth.router"));
const user_router_1 = __importDefault(require("./modules/user/user.router"));
const namespace_router_1 = __importDefault(require("./modules/namespace/namespace.router"));
const contact_router_1 = __importDefault(require("./modules/contacts/contact.router"));
const pv_router_1 = __importDefault(require("./modules/pv/pv.router"));
const app = (0, express_1.default)();
//? App Middlewares
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(headers_1.setHeaders);
app.use(express_1.default.static(path_1.default.join(__dirname, "../", "public")));
//? Routhers
app.use("/auth", auth_router_1.default);
app.use("/user", user_router_1.default);
app.use("/namespace", namespace_router_1.default);
app.use("/contact", contact_router_1.default);
app.use("/pv", pv_router_1.default);
//? 404 Error Handler
app.use((req, res, next) => {
    console.log(`This Path Not Found: ${req.path}`);
    (0, response_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, `This Path Not Found: ${req.path}`);
});
//? Error Global Handler
app.use(errHandler_1.errorHandler);
exports.default = app;
