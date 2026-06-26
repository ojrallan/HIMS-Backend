import { body } from "express-validator";

export const createItemValidation = [
  body("item_name").trim().notEmpty(),
  body("category").isIn(["Supplies", "Equipment", "Pharmaceuticals", "PPE"]),
  body("unit_of_measure").trim().notEmpty(),
  body("reorder_point").isInt({ min: 0 }),
  body("supplier_id").isInt({ min: 1 }),
];
