import express from "express";
import * as departmentController from "../controllers/department.controller.js";
import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { createDepartmentValidation } from "../validators/department.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";


const router = express.Router();

router.get("/", auth, departmentController.getDepartments);

router.get("/:id", auth, departmentController.getDepartment);

router.post(
  "/",
  auth,
  authorize("Admin"),
  createDepartmentValidation,
  validateRequest,
  departmentController.createDepartment,
);

router.put(
  "/:id",
  auth,
  authorize("Admin"),
  createDepartmentValidation,
  validateRequest,
  departmentController.updateDepartment,
);

router.delete(
  "/:id",
  auth,
  authorize("Admin"),
  departmentController.deleteDepartment,
);

export default router;
