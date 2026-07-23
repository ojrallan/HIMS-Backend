import * as inventoryService from "../services/inventory.service.js";

export const getAllInventory = async (req, res) => {
  try {
    const inventory = await inventoryService.getAllInventory();
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAnInventory = async (req, res) => {
  try {
    const inventory = await inventoryService.getInventoryById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory record not found",
      });
    }

    res.json(inventory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createInventory = async (req, res) => {
  try {
    const inventory = await inventoryService.createInventory(req.body);
    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const inventory = await inventoryService.updateInventory(
      req.params.id,
      req.body,
    );

    res.json(inventory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const inventory = await inventoryService.deleteInventory(req.params.id);
    res.json({
      message: "Inventory deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getLowStock = async (req, res) => {
  try {
    const inventory = await inventoryService.getLowStockItems();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getExpiringItems = async (req, res) => {
  try {
    const inventory = await inventoryService.getExpiringItems();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const searchInventory = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        message: "Search query is required.",
      });
    }
    const inventory = await inventoryService.searchInventory(q);

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateInventoryStock = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        message: "Quantity is required",
      });
    }

    const updatedInventory = await inventoryService.updateStock(
      inventoryId,
      quantity,
    );

    if (!updatedInventory) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      message: "Inventory updated successfully.",
      inventory: updatedInventory,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const reduceInventoryStock = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { quantity } = req.body;

    const updated = await inventoryService.reduceInventoryStock(
      inventoryId,
      quantity,
    );

    if (!updated) {
      return res.status(400).json({
        message: "Insufficient stock or invalid inventory ID",
      });
    }

    res.status(200).json({
      message: "Stock reduced successfully",
      inventory: updated,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
};
