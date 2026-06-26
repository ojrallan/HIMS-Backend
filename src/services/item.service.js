import pool from "../config/db.js";

export const getAllItems = async () => {
  const result = await pool.query(
    `SELECT 
        i.item_id,
        i.item_name,
        i.category,
        i.unit_of_measure,
        i.reorder_point,
        s.supplier_name
        FROM items i
        JOIN suppliers s
        ON i.supplier_id = s.supplier_id
        ORDER BY i.item_name;
        `,
  );

  return result.rows;
};

export const getItemById = async (id) => {
  const result = await pool.query(`SELECT * FROM items WHERE item_id=$1`, [id]);
  return result.rows[0];
};

export const addItem = async (item) => {
  const result = await pool.query(
    `
        INSERT INTO items 
        (
        item_name, 
        category, 
        unit_of_measure, 
        reorder_point, 
        supplier_id, 
        description
        )
        VALUES
        ($1, $2,$3, $4, $5,$6)
        RETURNING *
        `,
    [
      item.item_name,
      item.category,
      item.unit_of_measure,
      item.reoder_point,
      item.supplier_id,
      item.description,
    ],
  );

  return result.rows[0];
};

export const updateItem = async (id, item) => {
  const result = await pool.query(
    `
        UPDATE items
        SET
        item_name=$1,
        category=$2,
        unit_of_measure=$3,
        reorder_point=$4,
        supplier_id=$5,
        description=$6
        WHERE item_id=$7
        `,
    [
      item.item_name,
      item.category,
      item.unit_of_measure,
      item.reoder_point,
      item.supplier_id,
      item.description,
      id,
    ],
  );
  return result.rows[0];
};

export const deleteItem = async (id) => {
  const result = await pool.query(
    `
        DELETE FROM items
        WHERE department_id=$1
        RETURNING *
        `,
    [id],
  );

  return result.rows[0];
};
