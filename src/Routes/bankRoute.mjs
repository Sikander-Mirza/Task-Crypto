import express from 'express';
import authMiddleware from '../Middleware/authMiddleware.mjs';
import { createBankAccount, getAllBankAccounts } from '../Controllers/bankController.mjs';

const router = express.Router();

router.post('/create', authMiddleware, createBankAccount);
router.get('/accounts', authMiddleware, getAllBankAccounts);

export default router;
