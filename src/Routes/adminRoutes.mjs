import express from 'express';
import {
  updateKycStatus,
  getKycStatus,
  getAllUsers,
  getAllTransactions,
//   getUserChats,
  getOwnChatHistory
} from '../Controllers/adminController.mjs';
import authMiddleware from '../Middleware/authMiddleware.mjs';
// import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.post('/kyc/update', authMiddleware,  updateKycStatus);
router.get('/kyc/:user_id', authMiddleware,  getKycStatus);
router.get('/users', authMiddleware,  getAllUsers);
router.get('/transactions', authMiddleware,  getAllTransactions);
// router.get('/chats/:user_id', authMiddleware,  getUserChats);

// // For users to see their own history
router.get('/history',authMiddleware, getOwnChatHistory);

export default router;
