import express from "express";
import * as orderController from "../controllers/order.controller.js";
import auth from "../middleware/role.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { createOrderValidation } from "../validators/order.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", auth, orderController.getOrders);

router.get("/:id", auth, orderController.getOrder);

router.patch(
  "/:id/receive",
  auth,
  authorize("Admin", "Inventory Manager"),
  orderController.receiveOrder,
);

router.post(
  "/",
  auth,
  authorize("Admin", "Procurement Officer"),
  createOrderValidation,
  validateRequest,
  orderController.createOrder,
);

router.put(
  "/:id",
  auth,
  authorize("Admin", "Procurement Officer"),
  createOrderValidation,
  validateRequest,
  orderController.updateOrder,
);

router.delete(
  "/:id",
  auth,
  authorize("Admin", "Procurement Officer"),
  orderController.deleteOrder,
);

export default router;
