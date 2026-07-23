import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import itemRoutes from "./routes/item.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import orderRoutes from "./routes/order.routes.js";
import orderItemRoutes from "./routes/orderItem.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import stockTransactionRoutes from "./routes/stockTransaction.routes.js"
import equipmentRoutes from "./routes/equipment.routes.js"
import maintenanceRoutes from "./routes/maintenance.routes.js"


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/stock-transactions", stockTransactionRoutes)
app.use("/api/equipment", equipmentRoutes)
app.use("/api/maintenace", maintenanceRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "Hospital Inventory API Running",
  });
});

export default app;
