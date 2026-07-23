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

export const receiveOrder = async (orderId, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Check order exists and lock it

    const orderResult = await client.query(
      `
      SELECT *
      FROM orders
      WHERE order_id = $1
      FOR UPDATE
      `,
      [orderId],
    );

    if (orderResult.rows.length === 0) {
      throw new Error("Order not found.");
    }

    const order = orderResult.rows[0];

    if (order.status === "Received") {
      throw new Error("Order has already been received.");
    }

    if (order.status === "Cancelled") {
      throw new Error("Cancelled orders cannot be received.");
    }

    // 2. Get ordered items

    const orderItemsResult = await client.query(
      `
      SELECT
        oi.item_id,
        oi.quantity_ordered,
        oi.unit_price

      FROM order_items oi

      WHERE oi.order_id = $1
      `,
      [orderId],
    );

    if (orderItemsResult.rows.length === 0) {
      throw new Error("Order has no items.");
    }

    // 3. Process every item

    for (const item of orderItemsResult.rows) {
      // Find inventory in Central Store

      const inventoryResult = await client.query(
        `
        SELECT *
        FROM inventory

        WHERE item_id = $1
        AND department_id = $2

        FOR UPDATE
        `,
        [item.item_id, CENTRAL_STORE_ID],
      );

      if (inventoryResult.rows.length === 0) {
        throw new Error(`Inventory record missing for item ${item.item_id}`);
      }

      const inventory = inventoryResult.rows[0];

      // Increase inventory quantity

      await client.query(
        `
        UPDATE inventory

        SET
          quantity_in_stock =
          quantity_in_stock + $1,

          purchase_price = $2,

          last_updated = NOW()

        WHERE inventory_id = $3
        `,
        [item.quantity_ordered, item.unit_price, inventory.inventory_id],
      );

      // Create stock transaction

      await client.query(
        `
        INSERT INTO stock_transactions
        (
          item_id,
          department_id,
          user_id,
          transaction_type,
          quantity,
          remarks
        )

        VALUES
        (
          $1,
          $2,
          $3,
          'Purchase',
          $4,
          $5
        )
        `,
        [
          item.item_id,
          CENTRAL_STORE_ID,
          userId,
          item.quantity_ordered,
          `Received from purchase order #${orderId}`,
        ],
      );
    }

    // 4. Update order status

    const updatedOrder = await client.query(
      `
      UPDATE orders

      SET
        status = 'Received'

      WHERE order_id = $1

      RETURNING *
      `,
      [orderId],
    );

    await client.query("COMMIT");

    return updatedOrder.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};
