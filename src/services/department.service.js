import pool from "../config/db.js";

export const getAllDepartments = async () => {
  const result = await pool.query(
    `
        SELECT * FROM departments ORDER BY department_name
        `,
  );
  return result.rows;
};

export const getDepartmentById = async (id) => {
  const result = await pool.query(
    `
        SELECT * 
        FROM departments
        WHERE department_id = $1
        `,
    [id],
  );

  return result.rows[0];
};

export const createDepartment = async (department) => {
  const result = await pool.query(
    `
        INSERT INTO departments 
        (
        department_name,
        location,
        manager_name
        )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
    [department.department_name, department.location, department.manager_name],
  );

  return result.rows[0];
};

export const updateDepartment = async (id, department) => {
  const result = await pool.query(
    `
        UPDATE departments
        SET 
        department_name=$1,
        location=$2,
        manager_name=$3
        WHERE department_id=$4
        RETURNING *`,
    [
      department.department_name,
      department.location,
      department.manager_name,
      id,
    ],
  );

  return result.rows[0];
};

export const deleteDepartment = async (id) => {
  const result = await pool.query(
    `
        DELETE FROM departments
        WHERE department_id = $1
        RETURNING *
        `,
    [id],
  );

  return result.rows[0];
};
