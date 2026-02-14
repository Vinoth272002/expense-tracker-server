import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/current-user", protect, authController.getLoggedInUser);
router.post("/logout", authController.logoutUser);
router.post("/refresh-token", authController.refreshToken);

export default router;