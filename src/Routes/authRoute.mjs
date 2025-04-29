import express from 'express';
import { register, login, getProfile, updateProfile, logout } from '../Controllers/authController.mjs';
import authMiddleware from '../Middleware/authMiddleware.mjs';

const router = express.Router();

// Auth Routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/update-profile', authMiddleware, updateProfile);
router.post('/logout', authMiddleware, logout);

export default router;
