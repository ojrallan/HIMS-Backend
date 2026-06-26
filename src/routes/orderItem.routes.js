import express from "express";
import * as orderItemController from "../controllers/orderItem.controller.js";
import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { createOrderItemValidation } from "../validators/orderItem.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", auth, orderItemController.getOrderItems);
router.get("/:id", auth, orderItemController.getOrderItem);

router.post(
  "/",
  auth,
  authorize("Admin", "Procurement Officer"),
  createOrderItemValidation,
  validateRequest,
  orderItemController.createOrderItem,
);

router.put(
  "/:id",
  auth,
  authorize("Admin", "Procurement Officer"),
  createOrderItemValidation,
  validateRequest,
  orderItemController.updateOrderItem,
);

router.delete(
  "/:id",
  auth,
  authorize(
    "Admin",
    "Procurement Officer",
    orderItemController.deleteOrderItem,
  ),
);

export default router;