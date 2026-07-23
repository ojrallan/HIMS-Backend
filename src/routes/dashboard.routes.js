import express from "express";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

import * as dashboardController from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get(
  "/",
  auth,
  authorize("Admin", "Inventory Manager", "Procurement Officer"),
  dashboardController.getDashboardStats,
);

export default router;
