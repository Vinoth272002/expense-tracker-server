import express from 'express';
import { addExpense,
    deleteExpense,
    getAllExpenses,
    getExpenseById,
    downloadExpenseExcelFormat
} from '../controllers/expenseController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addExpense);
router.get("/", protect, getAllExpenses);
router.get("/:expenseId", protect, getExpenseById);
router.get("/export/excel", protect, downloadExpenseExcelFormat);
router.delete("/:expenseId", protect, deleteExpense);

export default router;