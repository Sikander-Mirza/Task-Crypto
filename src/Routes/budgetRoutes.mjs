import express from 'express';
import authenticate  from '../Middleware/authMiddleware.mjs';
import { setBudget, getBudgetStatus,getAllBudgets,updateBudget,deleteBudget,getAllBudgetStatuses } from '../Controllers/budgetController.mjs';

const router = express.Router();

router.post('/set', authenticate, setBudget);
router.get('/status', authenticate, getBudgetStatus);
router.get('/allstatus', authenticate, getAllBudgetStatuses);
router.get('/all', authenticate, getAllBudgets);
router.put('/update/:id', authenticate, updateBudget);
router.delete('/delete/:id', authenticate, deleteBudget);
export default router;
