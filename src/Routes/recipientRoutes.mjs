import express from 'express';
import { addRecipient, getRecipients } from '../Controllers/recipientController.mjs';
import authMiddleware from '../Middleware/authMiddleware.mjs';

const router = express.Router();

router.post('/add', authMiddleware, addRecipient);
router.get('/list', authMiddleware, getRecipients);

export default router;
