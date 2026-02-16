import express from 'express';
import * as incomeController from '../controllers/incomeController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, incomeController.addIncome);
router.get("/", protect, incomeController.getAllIncome);
router.get("/:incomeId", protect, incomeController.getIncomeById);
router.patch("/:incomeId", protect, incomeController.updateIncome)
router.get("/export/excel", protect, incomeController.downloadIncomeExcelFormat);
router.delete("/:incomeId", protect, incomeController.deleteIncome);

export default router;