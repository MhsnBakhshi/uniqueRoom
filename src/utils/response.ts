import { Response } from "express";
const successResponse = async (res: Response, statusCode: number = 200, data: any) => {
  return res
    .status(statusCode)
    .json({ status: statusCode, success: true, data });
};
const errorResponse = async (res: Response, statusCode: number, data: any) => {
  return res
    .status(statusCode)
    .json({ status: statusCode, success: false, data });
};

export {
  successResponse,
  errorResponse
}