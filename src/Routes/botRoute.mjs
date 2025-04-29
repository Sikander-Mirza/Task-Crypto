import express from 'express';
import { getBalance, getTransactions } from '../Controllers/botController.mjs';

const router = express.Router();

router.post('/get-balance', getBalance);
router.post('/get-transactions', getTransactions);
// router.post('/get-bills', getBills);

export default router;
