import express from 'express';
import { register, login, getProfile, updateProfile, logout,getAllUsers } from '../Controllers/authController.mjs';
import authMiddleware from '../Middleware/authMiddleware.mjs';

const router = express.Router();

// Auth Routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/update-profile', authMiddleware, updateProfile);
router.post('/logout', authMiddleware, logout);
router.get('/users', getAllUsers); // Public route for chatbot to fetch users

export default router;
