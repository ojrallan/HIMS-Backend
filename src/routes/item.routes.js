import express from "express";
import * as itemController from "../controllers/item.controller.js";
import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { createItemValidation } from "../validators/item.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", auth, itemController.getItems);
router.get("/:id", auth, itemController.getItem);

router.post(
  "/",
  auth,
  authorize("Admin", "Inventory Manager"),
  createItemValidation,
  validateRequest,
  itemController.addItem,
);

router.put(
  "/:id",
  auth,
  authorize(
    "Admin",
    "Inventory Manager",
    createItemValidation,
    validateRequest,
    itemController.updateItem,
  ),
);

router.delete(
  "/:id",
  auth,
  authorize("Admin", "Inventory Manager", itemController.deleteItem),
);

export default router;