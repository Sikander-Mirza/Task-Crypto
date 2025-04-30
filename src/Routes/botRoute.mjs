import express from "express";
import { queryAI } from "../Controllers/botController.mjs";

const router = express.Router();

router.post("/query", queryAI);

export default router;
