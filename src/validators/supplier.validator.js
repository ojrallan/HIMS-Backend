import { body } from "express-validator";

export const createSupplierValidation = [
  body("supplier_name")
    .trim()
    .notEmpty()
    .withMessage("Supplier name is required"),
  body("contact_person")
    .trim()
    .notEmpty()
    .withMessage("Contact person is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("email").optional().isEmail().withMessage("Invalid email"),
  body("address").trim().notEmpty().withMessage("Address is required"),
];
