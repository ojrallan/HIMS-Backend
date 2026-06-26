import pool from "../config/db.js";

//Helper function to update order totals
export const updateOrderTotal = async (orderId) => {
  //Calculate total
  const totalResult = await pool.query(
    `
            SELECT
      COALESCE(SUM(quantity_ordered * unit_price), 0) AS total
    FROM order_items
    WHERE order_id = $1

        `,
    [orderId],
  );

  const total = totalResult.rows[0].total;

  //update order
  await pool.query(
    `
    UPDATE orders
    SET total_amount=$1
    WHERE order_id=$2`,
    [total, orderId],
  );
};

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

  const orderItem = result.rows[0];

  await updateOrderTotal(orderItem.order_id);

  return orderItem;
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
  const orderItem = result.rows[0];

  await updateOrderTotal(orderItem.order_id);

  return orderItem;
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
  const deletedItem = result.rows[0];

  await updateOrderTotal(deletedItem.order_id);

  return deletedItem;
};
