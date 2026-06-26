import pool from "../config/db.js";

export const getAllSuppliers = async () => {
  const result = await pool.query(`
        SELECT * FROM suppliers ORDER BY supplier_name
        `);

  return result.rows;
};

export const getSupplierById = async (id) => {
  const result = await pool.query(
    `
        SELECT * FROM suppliers WHERE supplier_id = $1     
        `,
    [id],
  );

  return result.rows[0];
};

export const createSupplier = async (supplier) => {
  const { supplier_name, contact_person, phone, email, address } = supplier;

  //Check email uniques
  const existing = await pool.query(
    `
    SELECT supplier_id 
    FROM suppliers
    WHERE email = $1
    `,
    [email],
  );

  if (existing.rows.length) {
    throw new Error("Supplier email already exists");
  }

  // Insert new supplier record
  const result = await pool.query(
    `
    INSERT INTO suppliers (supplier_name, contact_person, phone, email, address) VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [supplier_name, contact_person, phone, email, address],
  );

  return result.rows[0];
};

export const updateSupplier = async (id, supplier) => {
  const { supplier_name, contact_person, phone, email, address } = supplier;

  const result = await pool.query(
    `
        UPDATE suppliers 
        SET
            supplier_name=$1,
            contact_person=$2,
            phone=$3,
            email=$4,
            address=$5
        WHERE supplier_id=$6
        RETURNING *
        `,
    [supplier_name, contact_person, phone, email, address, id],
  );

  return result.rows[0];
};

export const deleteSupplier = async (id) => {
  const result = await pool.query(
    `
        DELETE FROM suppliers 
        WHERE supplier_id = $1
        RETURNING *
        `,
    [id],
  );

  return result.rows[0];
};
