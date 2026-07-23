import { body } from "express-validator";

export const createMaintenanceValidation = [
  body("equipment_id")
    .notEmpty()
    .withMessage("Equipment is required.")
    .isInt({
      min: 1,
    })
    .withMessage("Invalid equipment ID."),

  body("maintenance_date")
    .notEmpty()
    .withMessage("Maintenance date is required.")
    .isISO8601()
    .withMessage("Invalid maintenance date."),

  body("next_maintenance")
    .optional()
    .isISO8601()
    .withMessage("Invalid next maintenance date."),

  body("performed_by")
    .notEmpty()
    .withMessage("Technician name is required.")
    .isLength({
      max: 100,
    })
    .withMessage("Technician name too long."),

  body("description")
    .notEmpty()
    .withMessage("Maintenance description is required."),

  body("cost")
    .optional()
    .isFloat({
      min: 0,
    })
    .withMessage("Cost must be a positive number."),
];
