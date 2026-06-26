import pool from "../config/db.js";

export const getAllInventory = async () => {
  const result = await pool.query(
    `
    SELECT
      inv.inventory_id,
      inv.item_id,
      i.item_name,
      i.category,
      inv.department_id,
      d.department_name,
      inv.quantity_in_stock,
      inv.purchase_price,
      inv.expiry_date,
      inv.last_updated
    FROM inventory inv
    JOIN items i
      ON inv.item_id = i.item_id
    JOIN departments d
      ON inv.department_id = d.department_id
    ORDER BY i.item_name
    `,
  );

  return result.rows;
};

export const getInventoryById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      inv.inventory_id,
      inv.item_id,
      i.item_name,
      i.category,
      inv.department_id,
      d.department_name,
      inv.quantity_in_stock,
      inv.purchase_price,
      inv.expiry_date,
      inv.last_updated
    FROM inventory inv
    JOIN items i
      ON inv.item_id = i.item_id
    JOIN departments d
      ON inv.department_id = d.department_id
    WHERE inv.inventory_id = $1
    `,
    [id],
  );

  return result.rows[0];
};

export const createInventory = async (inventory) => {
  const result = await pool.query(
    `
    INSERT INTO inventory
    (
      item_id,
      department_id,
      quantity_in_stock,
      purchase_price,
      expiry_date
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      inventory.item_id,
      inventory.department_id,
      inventory.quantity_in_stock,
      inventory.purchase_price,
      inventory.expiry_date,
    ],
  );

  return result.rows[0];
};

export const updateStock = async (inventoryId, quantity) => {
  const result = await pool.query(
    `
        UPDATE inventory
        SET quantity_in_stock=quantity_in_stock+$1,
        last_updated=NOW()
        WHERE inventory_id=$2
        RETURNING *
        `,
    [quantity, inventoryId],
  );

  return result.rows[0];
};

export const reduceInventoryStock = async (inventoryId, quantity) => {
  const result = await pool.query(
    `
    UPDATE inventory
    SET
        quantity_in_stock = quantity_in_stock - $1,
        last_updated = NOW()
    WHERE
        inventory_id = $2
        AND quantity_in_stock >= $1
    RETURNING *;
    `,
    [quantity, inventoryId],
  );

  return result.rows[0];
};

export const updateInventory = async (id, inventory) => {
  const result = await pool.query(
    `
    UPDATE inventory
    SET
      item_id = $1,
      department_id = $2,
      quantity_in_stock = $3,
      purchase_price = $4,
      expiry_date = $5,
      last_updated = CURRENT_TIMESTAMP
    WHERE inventory_id = $6
    RETURNING *
    `,
    [
      inventory.item_id,
      inventory.department_id,
      inventory.quantity_in_stock,
      inventory.purchase_price,
      inventory.expiry_date,
      id,
    ],
  );

  return result.rows[0];
};

export const deleteInventory = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM inventory
    WHERE inventory_id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

export const getLowStockItems = async () => {
  const result = await pool.query(
    `
    SELECT
      inv.inventory_id,
      i.item_name,
      i.category,
      inv.quantity_in_stock,
      i.reorder_point
    FROM inventory inv
    JOIN items i
      ON inv.item_id = i.item_id
    WHERE inv.quantity_in_stock <= i.reorder_point
    ORDER BY inv.quantity_in_stock ASC
    `,
  );

  return result.rows;
};

export const getExpiringItems = async (days = 30) => {
  const result = await pool.query(
    `
    SELECT
      inv.inventory_id,
      i.item_name,
      inv.quantity_in_stock,
      inv.expiry_date
    FROM inventory inv
    JOIN items i
      ON inv.item_id = i.item_id
    WHERE inv.expiry_date IS NOT NULL
      AND inv.expiry_date BETWEEN CURRENT_DATE
      AND CURRENT_DATE + ($1 * INTERVAL '1 day')
    ORDER BY inv.expiry_date
    `,
    [days],
  );

  return result.rows;
};

export const searchInventory = async (searchTerm) => {
  const result = await pool.query(
    `
         SELECT
        i.inventory_id,
        t.item_name,
        d.department_name,
        i.quantity_in_stock,
        i.purchase_price,
        i.expiry_date,
        i.last_updated
    FROM inventory i
    JOIN items t
        ON i.item_id = t.item_id
    JOIN departments d
        ON i.department_id = d.department_id
    WHERE
        t.item_name ILIKE $1
        OR d.department_name ILIKE $1
    ORDER BY t.item_name;
        `,
    [`%${searchTerm}`],
  );

  return result.rows;
};
