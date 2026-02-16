import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post("/register", upload.single("profilePic"), authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/current-user", protect, authController.getLoggedInUser);
router.post("/logout", authController.logoutUser);
router.post("/refresh-token", authController.refreshToken);
router.put("/profile", protect, authController.updateUserProfile);

export default router;