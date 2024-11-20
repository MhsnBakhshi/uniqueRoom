import * as yup from "yup";

interface ISendValidator {
  phone: string;
}

interface IVerifyValidator extends ISendValidator {
  otp: string;
}

export const sendValidatorSchema: yup.ObjectSchema<ISendValidator> = yup.object(
  {
    phone: yup
      .string()
      .matches(
        /^(0|98)?([ ]|-|[()]){0,2}9[0-4|9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}$/,
        "شماره تلفن معتبر نمیباشد"
      )
      .required("شماره تلفن اجباری است!"),
  }
);

export const verifyValidatorSchema: yup.ObjectSchema<IVerifyValidator> =
  yup.object({
    phone: yup
      .string()
      .matches(
        /^(0|98)?([ ]|-|[()]){0,2}9[0-4|9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}$/,
        "شماره تلفن معتبر نمیباشد"
      )
      .required("شماره تلفن اجباری است!"),
    otp: yup
      .string()
      .required("Otp code is required !!")
      .matches(/^[0-9]+$/, "Otp code is not valid !!")
      .max(6, "Otp should have 6 digit number"),
  });
