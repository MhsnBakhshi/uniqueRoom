import * as yup from "yup";

interface IContactValidator {
  nickname?: string;
  favorite?: boolean;
}

export const contactValidatorSchema: yup.ObjectSchema<IContactValidator> =
  yup.object({
    nickname: yup.string().max(25),
    favorite: yup.boolean(),
  });
