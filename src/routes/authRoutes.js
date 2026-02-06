import express from 'express';
import { registerUser, loginUser, getLoggedInUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current-user", protect, getLoggedInUser);

export default router;