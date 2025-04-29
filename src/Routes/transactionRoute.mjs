import express from 'express';
import authMiddleware from '../Middleware/authMiddleware.mjs';
import { sendTransfer, getTransactionHistory, withdrawFunds } from '../Controllers/transactionController.mjs';

const router = express.Router();

router.post('/transfer', authMiddleware, sendTransfer);
router.get('/history', authMiddleware, getTransactionHistory);
router.post('/withdraw', authMiddleware, withdrawFunds);

export default router;
