import express from 'express';
import * as expenseController from '../controllers/expenseController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, expenseController.addExpense);
router.get("/", protect, expenseController.getAllExpenses);
router.get("/:expenseId", protect, expenseController.getExpenseById);
router.patch("/:expenseId", protect, expenseController.updateExpense)
router.get("/export/excel", protect, expenseController.downloadExpenseExcelFormat);
router.delete("/:expenseId", protect, expenseController.deleteExpense);

export default router;