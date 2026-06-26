import * as supplierService from "../services/supplier.service.js";

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getAllSuppliers();

    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);

    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.updateSupplier(
      req.params.id,
      req.body,
    );

    res.json(supplier);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    await supplierService.deleteSupplier(req.params.id);

    res.json({
      message: "Supplier deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
