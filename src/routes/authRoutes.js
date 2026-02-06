import express from 'express';
import { registerUser, loginUser, getUserInfo } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current-user", protect, getUserInfo);

export default router;