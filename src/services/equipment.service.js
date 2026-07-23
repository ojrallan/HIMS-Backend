import pool from "../config/db.js";

export const getAllEquipment = async () => {
  const result = await pool.query(
    `
    SELECT
        e.equipment_id,
        e.equipment_name,
        e.serial_number,
        e.condition_status,
        e.purchase_date,
        e.next_maintenance,

        d.department_id,
        d.department_name

    FROM equipment e

    JOIN departments d
        ON e.department_id=d.department_id

    ORDER BY e.equipment_name
    `,
  );

  return result.rows;
};

export const getEquipmentById = async (id) => {
  const result = await pool.query(
    `
    SELECT
        e.*,
        d.department_name

    FROM equipment e

    JOIN departments d
        ON e.department_id=d.department_id

    WHERE equipment_id=$1
    `,
    [id],
  );

  return result.rows[0];
};

export const createEquipment = async (equipment) => {
  const result = await pool.query(
    `
    INSERT INTO equipment
    (
      equipment_name,
      serial_number,
      department_id,
      condition_status,
      purchase_date,
      next_maintenance
    )

    VALUES
    (
      $1,$2,$3,$4,$5,$6
    )

    RETURNING *
    `,
    [
      equipment.equipment_name,
      equipment.serial_number,
      equipment.department_id,
      equipment.condition_status,
      equipment.purchase_date,
      equipment.next_maintenance,
    ],
  );

  return result.rows[0];
};

export const updateEquipment = async (id, equipment) => {
  const result = await pool.query(
    `
    UPDATE equipment

    SET

      equipment_name=$1,
      serial_number=$2,
      department_id=$3,
      condition_status=$4,
      purchase_date=$5,
      next_maintenance=$6

    WHERE equipment_id=$7

    RETURNING *
    `,
    [
      equipment.equipment_name,
      equipment.serial_number,
      equipment.department_id,
      equipment.condition_status,
      equipment.purchase_date,
      equipment.next_maintenance,
      id,
    ],
  );

  return result.rows[0];
};

export const deleteEquipment = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM equipment

    WHERE equipment_id=$1

    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

export const getMaintenanceDue = async () => {
  const result = await pool.query(
    `
    SELECT *

    FROM equipment

    WHERE next_maintenance <= CURRENT_DATE

    ORDER BY next_maintenance
    `,
  );

  return result.rows;
};

export const searchEquipment = async (searchTerm) => {

  const result = await pool.query(
    `
    SELECT

        e.equipment_id,
        e.equipment_name,
        e.serial_number,
        e.condition_status,
        e.next_maintenance,

        d.department_name

    FROM equipment e

    JOIN departments d
        ON e.department_id=d.department_id

    WHERE

        e.equipment_name ILIKE $1

        OR e.serial_number ILIKE $1

        OR d.department_name ILIKE $1


    ORDER BY e.equipment_name

    `,
    [
      `%${searchTerm}%`
    ]
  );


  return result.rows;

};