import * as stockTransactionService from "../services/stockTransaction.service.js";

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await stockTransactionService.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTransactionsById = async (req, res) => {
  try {
    const transactions = await stockTransactionService.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await stockTransactionService.getTransactionById(
      req.params.id,
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const transaction = await stockTransactionService.createTransaction(
      req.body,
    );

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getTransactionsByItem = async (req, res) => {
  try {
    const transactions = await stockTransactionService.getTransactionsByItem(
      req.params.itemId,
    );
    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTransactionsByDepartment = async (req, res) => {
  try {
    const transactions =
      await stockTransactionService.getTransactionsByDepartment(
        req.params.departmentId,
      );
    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const searchTransactions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const transactions = await stockTransactionService.searchTransactions(q);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
