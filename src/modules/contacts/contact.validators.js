const yup = require("yup");

const contactValidatorSchema = yup.object({
  nickname: yup.string().max(25),
  favorite: yup.boolean(),
});

module.exports = {
  contactValidatorSchema
}