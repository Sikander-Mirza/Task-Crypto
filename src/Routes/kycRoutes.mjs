import express from 'express';
import { submitKyc } from '../Controllers/kycController.mjs';
import authMiddleware from '../Middleware/authMiddleware.mjs';
import { upload } from '../Middleware/multer.mjs';

const router = express.Router();

// Allow up to 3 documents
router.post('/submit', authMiddleware, upload.array('documents', 3), submitKyc);

export default router;
