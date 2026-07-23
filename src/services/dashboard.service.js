import pool from "../config/db.js";

export const getDashboardStats = async () => {
  const result = await pool.query(
    `

SELECT

(
SELECT COUNT(*)
FROM items
)
AS total_items,


(
SELECT COUNT(*)
FROM inventory
WHERE quantity_in_stock <=
(
SELECT MIN(reorder_point)
FROM items
)
)
AS low_stock_items,


(
SELECT COUNT(*)
FROM inventory
WHERE expiry_date IS NOT NULL
AND expiry_date <= CURRENT_DATE + INTERVAL '30 days'
)
AS expiring_items,


(
SELECT COUNT(*)
FROM orders
WHERE status='Pending'
)
AS pending_orders,


(
SELECT COUNT(*)
FROM equipment
WHERE condition_status='Under Repair'
)
AS equipment_under_repair,


(
SELECT COUNT(*)
FROM equipment
WHERE next_maintenance <= CURRENT_DATE
)
AS maintenance_due


`,
  );

  return result.rows[0];
};
