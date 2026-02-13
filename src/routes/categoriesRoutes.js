import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as categoryController from '../controllers/categoryController.js';

const router = express.Router();

router.post("/", protect, categoryController.addCategory);
router.get("/", protect, categoryController.getAllCategory);
router.get("/:categoryId", protect, categoryController.getCategory);
router.patch("/:categoryId", protect, categoryController.updateCategory);
router.delete("/:categoryId", protect, categoryController.deleteCategory);

export default router;