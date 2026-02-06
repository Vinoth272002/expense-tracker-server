import express from 'express';
import { addIncome, getAllIncome, deleteIncome, downloadIncomeExcelFormat } from '../controllers/incomeController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addIncome);
router.get("/", protect, getAllIncome);
router.get("/export/excel", protect, downloadIncomeExcelFormat);
router.delete("/:incomeId", protect, deleteIncome);

export default router;