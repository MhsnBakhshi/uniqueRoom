const yup = require("yup");

const createNamespaceValidator = yup.object({
  title: yup.string().required().trim().max(20).lowercase(),
  href: yup.string().required().trim().max(20).lowercase(),
});

module.exports = {
  createNamespaceValidator,
};
