import express from "express";
import * as supplierController from "../controllers/supplier.controller.js";
import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js"; 

const router = express.Router();

router.get("/", auth, supplierController.getSuppliers);

router.get("/:id", auth, supplierController.getSupplier);

router.post(
  "/",
  auth,
  authorize("Admin", "Procurement Officer"),
  supplierController.createSupplier,
);

router.put(
  "/:id",
  auth,
  authorize("Admin", "Procurement Officer"),
  supplierController.updateSupplier,
);

router.delete(
  "/:id",
  auth,
  authorize("Admin", "Procurement Officer"),
  supplierController.deleteSupplier,
);

export default router;

// import express from "express";
// import authorize from "../middleware/role.middleware.js";

// const router = express.Router();

// router.post("/suppliers");
