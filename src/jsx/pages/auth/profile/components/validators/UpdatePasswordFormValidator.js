import * as yup from "yup";

export const updatePasswordFormSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .min(8, "Current password must be at least 8 characters")
    .required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .notOneOf(
      [yup.ref("currentPassword")],
      "New password must be different from current password"
    )
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});
