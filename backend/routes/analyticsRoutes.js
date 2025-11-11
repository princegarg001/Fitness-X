import express from "express"
import {
  getCalorieLeaderboard,
  getActiveUsers,
  getUserStats,
  getGymAnalytics,
  getTrainerAssignments,
  getWeeklyActivity,
  getExerciseBreakdown,
} from "../controllers/analyticsController.js"
import { requireRole } from "../middleware/rbac.js"

const router = express.Router()

// Members can view their own stats
router.get("/user-stats", requireRole("member", "trainer", "admin"), getUserStats)

router.get("/weekly-activity", requireRole("member", "trainer", "admin"), getWeeklyActivity)
router.get("/exercise-breakdown", requireRole("member", "trainer", "admin"), getExerciseBreakdown)

// Everyone can view leaderboard and active users
router.get("/leaderboard", getCalorieLeaderboard)
router.get("/active-users", getActiveUsers)

// Only admins can view gym analytics
router.get("/gym-analytics", requireRole("admin"), getGymAnalytics)

// Trainers and admins can view assignments
router.get("/trainer-assignments", requireRole("trainer", "admin"), getTrainerAssignments)

export default router
