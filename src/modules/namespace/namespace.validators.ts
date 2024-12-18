import * as yup from "yup";

type CreateNamespaceType = {
  title: string;
  href: string;
  creator: string;
};
export const createNamespaceValidator: yup.ObjectSchema<CreateNamespaceType> =
  yup.object({
    title: yup.string().required().trim().max(20).lowercase(),
    href: yup.string().required().trim().max(20).lowercase(),
    creator: yup.string().required(),
  });
