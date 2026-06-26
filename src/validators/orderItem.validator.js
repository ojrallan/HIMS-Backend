import { body } from "express-validator";

export const createOrderItemValidation = [
  body("item_id")
    .notEmpty()
    .withMessage("Item ID is required")
    .isInt({ min: 1 })
    .withMessage("Item ID must be a positive integer"),
  body("order_id")
    .notEmpty()
    .withMessage("Order ID is required")
    .isInt({ min: 1 })
    .withMessage("Order ID must be a positive integer"),
  body("quantity_ordered")
    .notEmpty()
    .withMessage("Quantity ordered is required")
    .isInt({ min: 1 })
    .withMessage("Order item must be atleast 1"),
  body("unit_price")
    .notEmpty()
    .withMessage("Unit price is required")
    .isFloat({ min: 0 })
    .withMessage("Unit price must be a non-negative number"),
];
