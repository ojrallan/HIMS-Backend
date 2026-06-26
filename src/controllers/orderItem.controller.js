import * as orderItemService from "../services/orderItem.service.js";

export const getOrderItems = async (req, res) => {
  try {
    const orderItems = await orderItemService.getOrderItems();
    res.status(200).json(orderItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOrderItem = async (req, res) => {
  try {
    const orderItem = await orderItemService.getOrderItem(req.params.id);

    if (!orderItem) {
      return res.status(400).json({
        message: "Order item not found",
      });
    }

    res.json(orderItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createOrderItem = async (req, res) => {
  try {
    const orderItem = await orderItemService.addOrderItem(req.body);

    res.status(201).json(orderItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateOrderItem = async (req, res) => {
  try {
    const orderItem = await orderItemService.updateOrderItem(
      req.params.id,
      req.body,
    );

    res.json(orderItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteOrderItem = async (req, res) => {
  try {
    await orderItemService.deleteOrderItem(req.params.id);

    res.json({
      message: "Order Item deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
