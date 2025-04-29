import express from 'express';
import authMiddleware from '../Middleware/authMiddleware.mjs';
import { linkBankAccount, getLinkedAccounts } from '../Controllers/bankController.mjs';

const router = express.Router();

router.post('/link', authMiddleware, linkBankAccount);
router.get('/accounts', authMiddleware, getLinkedAccounts);

export default router;
