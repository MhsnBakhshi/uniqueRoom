import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "../../utils/response";
import { contactValidatorSchema } from "./contact.validators";
import { costomeUserRequest } from "../../middlewares/authGaurd";
import Contact, { IContact } from "../../models/Contact";
import User, { IUser } from "../../models/User";

interface AddBody {
  contactId: string;
  nickname?: string;
  favorite?: boolean;
}
export const add = async (
  req: Request<{}, {}, AddBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as costomeUserRequest).user;
    const { contactId, nickname, favorite } = req.body;

    await contactValidatorSchema.validate(
      { nickname, favorite },
      { abortEarly: false }
    );

    if (!isValidObjectId(contactId)) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "contactId is not valid",
      });
      return;
    }

    const isExistUser: IUser | null = await User.findById(contactId);

    if (!isExistUser) {
      errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "contact not found !!",
      });
      return;
    }

    const existingContact: IContact | null = await Contact.findOne({
      "contacts.user": contactId,
    });

    if (existingContact) {
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "contact is already exist in your contacts.",
      });
      return;
    }

    const contacts: {
      user: string;
      nickname?: string;
      favorite?: boolean;
    }[] = [
      {
        user: contactId,
        nickname,
        favorite,
      },
    ];

    const newContact = await Contact.create({
      user: user._id,
      contacts,
    });

    successResponse(res, StatusCodes.CREATED, {
      message: "contact added.",
      newContact,
    });
    return;
  } catch (err) {
    next(err);
  }
};
