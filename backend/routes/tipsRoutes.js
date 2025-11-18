import express from "express"
import { createTip, deleteTip, getAllTips, getRandomTip, updateTip } from "../controllers/tipsController.js"
import { requireRole } from "../middleware/rbac.js"

const router = express.Router()

// Public routes - anyone can get tips
router.get("/random", getRandomTip)
router.get("/", getAllTips)

// Admin only routes - manage tips
router.post("/", requireRole("admin"), createTip)
router.patch("/:id", requireRole("admin"), updateTip)
router.delete("/:id", requireRole("admin"), deleteTip)

export default router
