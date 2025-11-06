import express from "express"
import { getRecommendation } from "../controllers/chatbotController.js"
import { authenticate } from "../middleware/authMiddleware.js"
import { authorize } from "../middleware/rbacMiddleware.js"

const router = express.Router()

router.post("/recommendations", authenticate, authorize(["MEMBER"]), getRecommendation)

export default router
