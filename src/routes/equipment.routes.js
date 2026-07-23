import express from "express";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";

import * as equipmentController from "../controllers/equipment.controller.js";

import { createEquipmentValidation } from "../validators/equipment.validator.js";

const router = express.Router();

router.get("/", auth, equipmentController.getAllEquipment);

router.get(
  "/maintenance-due",
  auth,
  authorize("Admin", "Inventory Manager"),
  equipmentController.getMaintenanceDue,
);

router.get("/search", auth, equipmentController.searchEquipment);

router.get("/:id", auth, equipmentController.getEquipmentById);

router.post(
  "/",
  auth,
  authorize("Admin", "Inventory Manager"),
  createEquipmentValidation,
  validateRequest,
  equipmentController.createEquipment,
);

router.put(
  "/:id",
  auth,
  authorize("Admin", "Inventory Manager"),
  createEquipmentValidation,
  validateRequest,
  equipmentController.updateEquipment,
);

router.delete(
  "/:id",
  auth,
  authorize("Admin", "Inventory Manager"),
  equipmentController.deleteEquipment,
);

export default router;
