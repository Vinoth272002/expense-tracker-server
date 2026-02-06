import express from 'express';
import { addIncome, getAllIncome, deleteIncome, downloadIncomeExcelFormat } from '../controllers/incomeController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-income", protect, addIncome);
router.get("/get-all-incomes", protect, getAllIncome);
router.get("/download-income-exacel", protect, downloadIncomeExcelFormat);
router.delete("/delete-income/:id", protect, deleteIncome);

export default router;