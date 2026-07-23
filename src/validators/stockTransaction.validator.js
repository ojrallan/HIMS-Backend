import { body } from "express-validator";

export const createStockTransactionValidation = [
  body("item_id")
    .notEmpty()
    .withMessage("Item is required.")
    .isInt({ min: 1 })
    .withMessage("Invalid item id."),

  body("department_id")
    .notEmpty()
    .withMessage("Department is required.")
    .isInt({ min: 1 })
    .withMessage("Invalid department id."),

  body("transaction_type")
    .notEmpty()
    .withMessage("Transaction type is required.")
    .isIn(["Purchase", "Issued", "Returned", "Disposed", "Adjusted"])
    .withMessage("Invalid transaction type."),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 1 })
    .withMessage("Quantity must be greater than zero."),

  body("remarks")
    .optional()
    .isLength({
      max: 500,
    })
    .withMessage("Remarks cannot exceed 500 characters."),
];
