import * as maintenanceService from "../services/maintenance.service.js";

export const getAllMaintenanceLogs = async (req, res) => {
  try {
    const logs = await maintenanceService.getAllMaintenanceLogs();

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMaintenanceLogById = async (req, res) => {
  try {
    const log = await maintenanceService.getMaintenanceLogById(req.params.id);

    if (!log) {
      return res.status(404).json({
        message: "Maintenance log not found",
      });
    }

    res.json(log);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createMaintenanceLog = async (req, res) => {
  try {
    const log = await maintenanceService.createMaintenanceLog(req.body);

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateMaintenanceLog = async (req, res) => {
  try {
    const log = await maintenanceService.updateMaintenanceLog(
      req.params.id,
      req.body,
    );

    res.json(log);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteMaintenanceLog = async (req, res) => {
  try {
    await maintenanceService.deleteMaintenanceLog(req.params.id);

    res.json({
      message: "Maintenance log deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMaintenanceByEquipment = async (req, res) => {
  try {
    const logs = await maintenanceService.getMaintenanceByEquipment(
      req.params.equipmentId,
    );

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
