import express from 'express';
import authenticate  from '../Middleware/authMiddleware.mjs';
import { setBudget, getBudgetStatus } from '../Controllers/budgetController.mjs';

const router = express.Router();

router.post('/set', authenticate, setBudget);
router.get('/status', authenticate, getBudgetStatus);

export default router;
