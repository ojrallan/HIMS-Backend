import express from "express";
import * as inventoryController from "../controllers/inventory.controller.js";
import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { createInventoryValidation } from "../validators/inventory.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", auth, inventoryController.getAllInventory);

router.get("/:id", auth, inventoryController.getAnInventory);

router.get(
  "/expiring",
  auth,
  authorize("Admin", "Inventory Manager", inventoryController.getExpiringItems),
);

router.get(
  "/low-stock",
  auth,
  authorize("Admin", "Inventory Manager", inventoryController.getLowStock),
);

router.get("/search", auth, inventoryController.searchInventory);

router.patch(
  "/:id",
  auth,
  authorize("Admin", "Inventory Manager"),
  inventoryController.updateInventoryStock,
);
router.patch(
  "/reduce/:id",
  auth,
  authorize(
    "Admin",
    "Inventory Manager",
    inventoryController.reduceInventoryStock,
  ),
);

router.post(
  "/",
  auth,
  authorize("Admin", "Inventory Manager"),
  createInventoryValidation,
  validateRequest,
  inventoryController.createInventory,
);

router.put(
  "/:id",
  auth,
  authorize(
    "Admin",
    "Inventory Manager",
    createInventoryValidation,
    validateRequest,
    inventoryController.updateInventory,
  ),
);

router.delete(
  "/:id",
  auth,
  authorize("Admin", "Inventory Manager", inventoryController.deleteInventory),
);

export default router;
