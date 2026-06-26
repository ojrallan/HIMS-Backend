import * as itemService from "../services/item.service.js";

export const getItems = async (req, res) => {
  try {
    const items = await itemService.getAllItems();

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getItem = async (req, res) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    if (!item) {
      return res.json(404).json({
        message: "Item not found",
      });
    }
    res.json({ item });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addItem = async (req, res) => {
  try {
    const item = await itemService.addItem(req.body);
    res.status(201).json({ item });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await itemService.updateItem(req.params.id, req.body);
    res.json({ item });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    await itemService.deleteItem(req.params.id);
    res.json({
      message: "Item deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
