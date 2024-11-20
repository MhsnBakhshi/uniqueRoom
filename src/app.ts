import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import { StatusCodes } from "http-status-codes";
import { setHeaders } from "./middlewares/headers";
import { errorHandler } from "./middlewares/errHandler";
import { errorResponse } from "./utils/response";

import authRouther from "./modules/auth/auth.router";
import userRouther from "./modules/user/user.router";
import namespaceRouther from "./modules/namespace/namespace.router";
import contactRouther from "./modules/contacts/contact.router";

const app = express();

//? App Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(setHeaders);
app.use(express.static(path.join(__dirname, "../", "public")));

//? Routhers
app.use("/auth", authRouther);
app.use("/user", userRouther);
app.use("/namespace", namespaceRouther);
app.use("/contact", contactRouther);

//? 404 Error Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`This Path Not Found: ${req.path}`);

  errorResponse(res, StatusCodes.NOT_FOUND, `This Path Not Found: ${req.path}`);
});

//? Error Global Handler
app.use(errorHandler);

export default app;
