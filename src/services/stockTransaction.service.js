import pool from "../config/db.js";

const increaseStockTransactions = ["Purchase", "Returned"];

const decreaseStockTransactions = ["Issued", "Disposed"];

export const getAllTransactions = async () => {
  const result = await pool.query(
    `
    SELECT
        st.transaction_id,
        st.transaction_type,
        st.quantity,
        st.transaction_date,
        st.remarks,

        i.item_id,
        i.item_name,

        d.department_id,
        d.department_name,

        u.user_id,
        u.full_name

    FROM stock_transactions st

    JOIN items i
        ON st.item_id = i.item_id

    JOIN departments d
        ON st.department_id = d.department_id

    JOIN users u
        ON st.user_id = u.user_id

    ORDER BY st.transaction_date DESC
    `,
  );

  return result.rows;
};

export const getTransactionById = async (id) => {
  const result = await pool.query(
    `
    SELECT
        st.*,
        i.item_name,
        d.department_name,
        u.full_name

    FROM stock_transactions st

    JOIN items i
        ON st.item_id=i.item_id

    JOIN departments d
        ON st.department_id=d.department_id

    JOIN users u
        ON st.user_id=u.user_id

    WHERE st.transaction_id=$1
    `,
    [id],
  );

  return result.rows[0];
};

export const getTransactionsByItem = async (itemId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM stock_transactions

    WHERE item_id=$1

    ORDER BY transaction_date DESC
    `,
    [itemId],
  );

  return result.rows;
};

export const getTransactionsByDepartment = async (departmentId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM stock_transactions

    WHERE department_id=$1

    ORDER BY transaction_date DESC
    `,
    [departmentId],
  );

  return result.rows;
};

export const searchTransactions = async (searchTerm) => {
  const result = await pool.query(
    `
    SELECT
        st.transaction_id,
        st.transaction_type,
        st.quantity,
        st.transaction_date,

        i.item_name,
        d.department_name,
        u.full_name

    FROM stock_transactions st

    JOIN items i
        ON st.item_id=i.item_id

    JOIN departments d
        ON st.department_id=d.department_id

    JOIN users u
        ON st.user_id=u.user_id


    WHERE
        i.item_name ILIKE $1
        OR d.department_name ILIKE $1
        OR u.full_name ILIKE $1

    ORDER BY st.transaction_date DESC
    `,
    [`%${searchTerm}%`],
  );

  return result.rows;
};

export const createTransaction = async (transaction) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const inventoryResult = await client.query(
      `
      SELECT *

      FROM inventory

      WHERE item_id=$1

      AND department_id=$2

      FOR UPDATE
      `,
      [transaction.item_id, transaction.department_id],
    );

    if (inventoryResult.rows.length === 0) {
      throw new Error(
        "Inventory record does not exist for this item and department.",
      );
    }

    const inventory = inventoryResult.rows[0];

    let updatedQuantity = inventory.quantity_in_stock;

    /*
       Increase stock
    */

    if (increaseStockTransactions.includes(transaction.transaction_type)) {
      updatedQuantity += transaction.quantity;
    }

    /*
       Decrease stock
    */

    if (decreaseStockTransactions.includes(transaction.transaction_type)) {
      if (inventory.quantity_in_stock < transaction.quantity) {
        throw new Error("Insufficient stock available.");
      }

      updatedQuantity -= transaction.quantity;
    }

    /*
       Manual adjustment
    */

    if (transaction.transaction_type === "Adjusted") {
      updatedQuantity = transaction.quantity;
    }

    await client.query(
      `
      UPDATE inventory

      SET
        quantity_in_stock=$1,
        last_updated=NOW()

      WHERE inventory_id=$2
      `,
      [updatedQuantity, inventory.inventory_id],
    );

    const result = await client.query(
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
        $1,$2,$3,$4,$5,$6
      )

      RETURNING *
      `,
      [
        transaction.item_id,
        transaction.department_id,
        transaction.user_id,
        transaction.transaction_type,
        transaction.quantity,
        transaction.remarks,
      ],
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};
