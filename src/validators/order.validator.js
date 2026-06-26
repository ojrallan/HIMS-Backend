import { body } from "express-validator";

export const createOrderValidation = [
  body("supplier_id")
    .notEmpty()
    .withMessage("Supplier ID is required")
    .isInt({ min: 1 })
    .withMessage("Supplier ID must be a positive integer"),
  body("ordered_by")
    .notEmpty()
    .withMessage("Ordered by is required")
    .isInt({ min: 1 })
    .withMessage("Ordered by must be a positive integer"),
  body("total_amount")
    .notEmpty()
    .withMessage("Total amount is required")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a non-negative number."),
];
