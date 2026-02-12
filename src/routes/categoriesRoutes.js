import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addCategory, updateCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.post("/", protect, addCategory);
// router.get("/", protect, getAllCategories);
// router.get("/:categoryId", protect, getCategoryById);
router.put("/:categoryId", protect, updateCategory);
// router.delete("/:categoryId", protect, deleteCategory);

export default router;