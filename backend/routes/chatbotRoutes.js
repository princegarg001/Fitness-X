import express from "express";
import { getRecommendation } from "../controllers/chatbotController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/recommendations", authMiddleware, getRecommendation);

export default router;
