import { errorResponse } from "../utils/response";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "yup";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "ValidationError") {
    const errors: { field: string; message: string }[] = [];

    (err as ValidationError).inner.forEach((e) => {
      errors.push({
        field: e.path || "unknown",
        message: e.message,
      });
    });

    console.log({ success: false, error: "Validation Error" });
    return errorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      `Validation Error => ${errors}`
    );
  }

  let status: number = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  let message: string = err.message || "INTERNAL SERVER ERROR";

  console.log({ success: false, error: message });

  return errorResponse(res, status, message);
};

export { errorHandler };
