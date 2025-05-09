import express from 'express';
import { generateUserQRCode } from '../Controllers/qrController.mjs';
import  authenticate  from '../Middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/generate', authenticate, generateUserQRCode);

export default router;
