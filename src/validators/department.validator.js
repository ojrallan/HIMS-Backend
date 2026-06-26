import { body } from "express-validator";

export const createDepartmentValidation = [
  body("department_name").trim().notEmpty(),
  body("location").trim().notEmpty(),
  body("manager_name").optional().trim(),
];
