import express from "express"
import {
  createWorkout,
  listWorkouts,
  getWorkoutStats,
  assignWorkout,
  getAssignedWorkouts,
  completeWorkout,
} from "../controllers/workoutController.js"
import { requireRole } from "../middleware/rbac.js"

const router = express.Router()

// Members can create and list their own workouts
router.post("/", requireRole("member", "trainer"), createWorkout)
router.get("/", listWorkouts)
router.get("/stats/breakdown", getWorkoutStats)

// Trainers can assign workouts to members
router.post("/assign", requireRole("trainer", "admin"), assignWorkout)
router.post("/:id/assign", requireRole("trainer", "admin"), assignWorkout)
router.get("/assigned", requireRole("member", "trainer", "admin"), getAssignedWorkouts)

// Members can mark workouts as complete
router.patch("/:id/complete", requireRole("member"), completeWorkout)

export default router
