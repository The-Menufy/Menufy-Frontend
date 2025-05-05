import * as yup from "yup";

export const editFormSchema = yup.object().shape({
  firstName: yup
    .string()
    .strict()
    .trim()
    .matches(/^[A-Za-z]+$/, "First name must contain only letters")
    .min(3, "First name must be at least 3 characters")
    .optional(),

  lastName: yup
    .string()
    .strict()
    .trim()
    .matches(/^[A-Za-z]+$/, "Last name must contain only letters")
    .min(3, "Last name must be at least 3 characters")
    .optional(),

  email: yup
    .string()
    .strict()
    .trim()
    .matches(
      /^[\w-.]+@([\w-]+\.)+(com|tn)$/,
      "Email must be a valid .com or .tn address"
    )
    .optional(),

  phone: yup
    .string()
    .strict()
    .trim()
    .matches(/^\+?\d{8,15}$/, "Enter a valid phone number")
    .optional(),

  address: yup
    .string()
    .strict()
    .trim()
    .min(5, "address must be at least 5 caracters long")
    .optional(),

  birthday: yup
    .date()
    .max(new Date(), "Birthday cannot be in the future")
    .optional(),

  restaurant: yup.object().shape({
    name: yup
      .string()
      .strict()
      .trim()
      .matches(/^[A-Za-z\s]+$/, "Restaurant name must contain only letters")
      .min(5, "Restaurant name must be more than 4 characters")
      .optional(),

    address: yup
      .string()
      .strict()
      .trim()
      .min(5, "Address must be at least 5 characters")
      .optional(),

    cuisineType: yup
      .string()
      .strict()
      .trim()
      .matches(/^[A-Za-z\s]+$/, "Cuisine type must contain only letters")
      .optional(),

    taxeTPS: yup
      .string()
      .strict()
      .trim()
      .matches(/^\d+(\.\d{1,2})?$/, "TPS tax must be a valid number")
      .optional(),

    taxeTVQ: yup
      .string()
      .strict()
      .trim()
      .matches(/^\d+(\.\d{1,2})?$/, "TVQ tax must be a valid number")
      .optional(),

    promotion: yup.string().strict().trim(),
    payCashMethod: yup.boolean().strict().optional(),
  }),
});
