import express from "express";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";

import * as stockTransactionController from "../controllers/stockTransaction.controller.js";

import { createStockTransactionValidation } from "../validators/stockTransaction.validator.js";

const router = express.Router();

router.get("/", auth, stockTransactionController.getAllTransactions);

router.get("/search", auth, stockTransactionController.searchTransactions);

router.get(
  "/item/:itemId",
  auth,
  stockTransactionController.getTransactionsByItem,
);

router.get(
  "/department/:departmentId",
  auth,
  stockTransactionController.getTransactionsByDepartment,
);

router.get("/:id", auth, stockTransactionController.getTransactionById);

router.post(
  "/",
  auth,
  authorize("Admin", "Inventory Manager"),
  createStockTransactionValidation,
  validateRequest,
  stockTransactionController.createTransaction,
);

export default router;
