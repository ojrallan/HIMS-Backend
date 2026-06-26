import { body } from "express-validator";

export const updateOrderStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Pending", "Shipped", "Received", "Cancelled"])
    .withMessage("Status must be Pending, Shipped, Received or Cancelled"),
];
