import * as yup from "yup";

interface IEditUser {
  name?: string;
  bio?: string;
  email?: string;
}

export const editUserInfoValidator: yup.ObjectSchema<IEditUser> = yup.object({
  name: yup.string().max(40).trim(),
  bio: yup.string().max(55).trim(),
  email: yup
    .string()
    .max(55)
    .trim()
    .matches(
      /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/,
      "Email format is not valid"
    ),
});
