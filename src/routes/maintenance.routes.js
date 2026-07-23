import express from "express";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";

import * as maintenanceController from "../controllers/maintenance.controller.js";

import { createMaintenanceValidation } from "../validators/maintenance.validator.js";

const router = express.Router();

router.get("/", auth, maintenanceController.getAllMaintenanceLogs);

router.get(
  "/equipment/:equipmentId",
  auth,
  maintenanceController.getMaintenanceByEquipment,
);

router.get("/:id", auth, maintenanceController.getMaintenanceLogById);

router.post(
  "/",
  auth,
  authorize("Admin", "Inventory Manager"),
  createMaintenanceValidation,
  validateRequest,
  maintenanceController.createMaintenanceLog,
);

router.put(
  "/:id",
  auth,
  authorize("Admin", "Inventory Manager"),
  createMaintenanceValidation,
  validateRequest,
  maintenanceController.updateMaintenanceLog,
);

router.delete(
  "/:id",
  auth,
  authorize("Admin", "Inventory Manager"),
  maintenanceController.deleteMaintenanceLog,
);

export default router;
