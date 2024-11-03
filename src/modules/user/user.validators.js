const yup = require("yup");

const editUserInfoValidator = yup.object({
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

module.exports = {
  editUserInfoValidator,
};
