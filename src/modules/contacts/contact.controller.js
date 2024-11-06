const { isValidObjectId } = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { errorResponse, successResponse } = require("../../utils/response");
const { contactValidatorSchema } = require("./contact.validators");
const Contact = require("../../models/Contact");
const User = require("../../models/User");
exports.add = async (req, res, next) => {
  try {
    const user = req.user;
    const { contactId, nickname, favorite } = req.body;

    await contactValidatorSchema.validate(
      { nickname, favorite },
      { abortEarly: false }
    );

    if (!isValidObjectId(contactId)) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "contactId is not valid",
      });
    }

    const isExistUser = await User.findById(contactId);

    if (!isExistUser) {
      return errorResponse(res, StatusCodes.NOT_FOUND, {
        message: "contact not found !!",
      });
    }

    const existingContact = await Contact.findOne({
      "contacts.user": contactId,
    });

    if (existingContact) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "contact is already exist in your contacts.",
      });
    }

    const contacts = [
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

    return successResponse(res, StatusCodes.CREATED, {
      message: "contact added.",
      newContact,
    });
  } catch (err) {
    next(err);
  }
};
