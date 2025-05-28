import express from "express";
import { queryAI,getChatHistory } from "../Controllers/botController.mjs";
import authMiddleware from "../Middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/query", queryAI);
router.get("/history/:user_id", getChatHistory)
export default router;
