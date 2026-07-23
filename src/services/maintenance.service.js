import pool from "../config/db.js";

export const getAllMaintenanceLogs = async () => {
  const result = await pool.query(
    `
SELECT

m.log_id,
m.maintenance_date,
m.performed_by,
m.description,
m.cost,


e.equipment_id,
e.equipment_name,


d.department_name


FROM maintenance_logs m


JOIN equipment e

ON m.equipment_id=e.equipment_id


JOIN departments d

ON e.department_id=d.department_id


ORDER BY m.maintenance_date DESC

`,
  );

  return result.rows;
};

export const getMaintenanceLogById = async (id) => {
  const result = await pool.query(
    `
SELECT *

FROM maintenance_logs

WHERE log_id=$1

`,
    [id],
  );

  return result.rows[0];
};

export const createMaintenanceLog = async (log) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert maintenance record

    const result = await client.query(
      `
INSERT INTO maintenance_logs
(
 equipment_id,
 maintenance_date,
 performed_by,
 description,
 cost
)

VALUES
(
 $1,$2,$3,$4,$5
)

RETURNING *

`,
      [
        log.equipment_id,
        log.maintenance_date,
        log.performed_by,
        log.description,
        log.cost,
      ],
    );

    // Update equipment status

  await client.query(
`
UPDATE equipment

SET

condition_status='Good',

next_maintenance=$2

WHERE equipment_id=$1

`,
[
log.equipment_id,
log.next_maintenance
]
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

export const updateMaintenanceLog = async (id, log) => {
  const result = await pool.query(
    `
UPDATE maintenance_logs

SET

maintenance_date=$1,
performed_by=$2,
description=$3,
cost=$4


WHERE log_id=$5


RETURNING *

`,
    [log.maintenance_date, log.performed_by, log.description, log.cost, id],
  );

  return result.rows[0];
};

export const deleteMaintenanceLog = async (id) => {
  const result = await pool.query(
    `
DELETE FROM maintenance_logs

WHERE log_id=$1

RETURNING *

`,
    [id],
  );

  return result.rows[0];
};

export const getMaintenanceByEquipment = async (equipmentId) => {
  const result = await pool.query(
    `
SELECT

m.log_id,
m.maintenance_date,
m.performed_by,
m.description,
m.cost


FROM maintenance_logs m


WHERE equipment_id=$1


ORDER BY maintenance_date DESC

`,
    [equipmentId],
  );

  return result.rows;
};
