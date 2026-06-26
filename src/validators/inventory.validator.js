import { body } from "express-validator";

export const createInventoryValidation = [
  body("item_id").isInt({ min: 1 }),
  body("department_id").isInt({ min: 1 }),
  body("quantity_in_stock").isInt({ min: 0 }),
  body("purchase_price").isFloat({ min: 0 }),
  body("expiry_date").optional().isISO8601(),
];
