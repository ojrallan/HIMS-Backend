import * as equipmentService from "../services/equipment.service.js";

export const getAllEquipment = async (req, res) => {
  try {
    const equipment = await equipmentService.getAllEquipment();

    res.json(equipment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getEquipmentById = async (req, res) => {
  try {
    const equipment = await equipmentService.getEquipmentById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found",
      });
    }

    res.json(equipment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createEquipment = async (req, res) => {
  try {
    const equipment = await equipmentService.createEquipment(req.body);

    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const equipment = await equipmentService.updateEquipment(
      req.params.id,
      req.body,
    );

    res.json(equipment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    await equipmentService.deleteEquipment(req.params.id);

    res.json({
      message: "Equipment deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMaintenanceDue = async (req, res) => {
  try {
    const equipment = await equipmentService.getMaintenanceDue();

    res.json(equipment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const searchEquipment = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Search query required",
      });
    }

    const equipment = await equipmentService.searchEquipment(q);

    res.json(equipment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
