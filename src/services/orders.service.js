import pool from "../config/db.js";

export const getAllOrders = async () => {
  const result = await pool.query(`SELECT * FROM orders`);

  return result.rows;
};

export const getOrderById = async (id) => {
  const result = await pool.query(`SELECT * FROM orders WHERE order_id=$1`, [
    id,
  ]);

  return result.rows[0];
};

export const createOrder = async (order) => {
  const result = await pool.query(
    `INSERT INTO orders
        (supplier_id, ordered_by, order_date, expected_delivery, total_amount)
        VALUES
        ($1, $2, NOW(), NOW() + INTERVAL '3 days', $3)
        RETURNING *;
        `,
    [order.supplier_id, order.ordered_by, order.total_amount],
  );

  return result.rows[0];
};

export const updateOrder = async (id, order) => {
  const result = await pool.query(
    `
        UPDATE orders
        SET 
        supplier_id=$1,
        ordered_by=$2,
        order_date=$3,
        expected_delivery=$4,
        status=$5,
        total_amount=$6
        WHERE order_id=$7
        RETURNING *, 
        `,
    [
      order.supplier_id,
      order.ordered_by,
      order.order_date,
      order.expected_delivery,
      order.status,
      order.total_amount,
      id,
    ],
  );

  return result.rows[0];
};

export const deleteOrder = async (id) => {
  const result = await pool.query(
    `DELETE FROM orders WHERE order_id=$1 RETURNING *`,
    [id],
  );

  return result.rows[0];
};
