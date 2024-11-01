const yup = require("yup");

const sendValidatorSchema = yup.object({
  phone: yup
  .string("شماره تلفن باید بصورت متن باشد")
  .matches(
    /^(0|98)?([ ]|-|[()]){0,2}9[0-4|9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}$/,
    "شماره تلفن معتبر نمیباشد"
  )
  .required("شماره تلفن اجباری است!"),
});

const verifyValidatorSchema = yup.object({
  phone: yup
  .string("شماره تلفن باید بصورت متن باشد")
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

module.exports = {
  sendValidatorSchema,
  verifyValidatorSchema,
};
