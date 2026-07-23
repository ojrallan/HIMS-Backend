import { body } from "express-validator";

export const createEquipmentValidation = [
  body("equipment_name")
    .notEmpty()
    .withMessage("Equipment name is required.")
    .isLength({
      max: 200,
    })
    .withMessage("Equipment name too long."),

  body("serial_number")
    .optional()
    .isLength({
      max: 100,
    })
    .withMessage("Serial number too long."),

  body("department_id")
    .notEmpty()
    .withMessage("Department is required.")
    .isInt({
      min: 1,
    })
    .withMessage("Invalid department ID."),

  body("condition_status")
    .optional()
    .isIn(["New", "Good", "Fair", "Under Repair", "Retired"])
    .withMessage("Invalid equipment condition."),

  body("purchase_date")
    .optional()
    .isISO8601()
    .withMessage("Invalid purchase date."),

  body("next_maintenance")
    .optional()
    .isISO8601()
    .withMessage("Invalid maintenance date."),
];
