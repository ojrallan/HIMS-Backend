import pool from "../config/db.js";

export const getOrderItems = async () => {
  const result = await pool.query(`SELECT * FROM order_items`);

  return result.rows;
};

export const getOrderItem = async (id) => {
  const result = await pool.query(
    `SELECT * FROM order_items WHERE order_item_id=$1`,
    [id],
  );

  return result.rows[0];
};

export const addOrderItem = async (orderItem) => {
  const result = await pool.query(
    `
        INSERT INTO order_items 
        (item_id, order_id, quantity_ordered, unit_price)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *
        `,
    [
      orderItem.item_id,
      orderItem.order_id,
      orderItem.quantity_ordered,
      orderItem.unit_price,
    ],
  );

  return result.rows[0];
};

export const updateOrderItem = async (id, orderItem) => {
  const result = await pool.query(
    `
        UPDATE items 
        SET
        item_id=$1,
        order_id=$2,
        quantity_ordered=$3,
        unit_price=$4
        WHERE item_id=$5
        `,
    [
      orderItem.item_id,
      orderItem.order_id,
      orderItem.quantity_ordered,
      orderItem.unit_price,
      id,
    ],
  );

  return result.rows[0];
};

export const deleteOrderItem = async (id) => {
  const result = await pool.query(
    `
        DELETE FROM order_items
        WHERE order_item_id = $1
        RETURNING *
        `,
    [id],
  );

  return result.rows[0];
};
