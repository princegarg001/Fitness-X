import express from "express"
import {
  getNearbyGyms,
  getAllGyms,
  getGymDetails,
  createGym,
  updateGym,
  deleteGym,
} from "../controllers/gymController.js"
import { requireRole } from "../middleware/rbac.js"

const router = express.Router()

// Members and trainers can search gyms
router.get("/near", getNearbyGyms)
router.get("/", getAllGyms)
router.get("/:id", getGymDetails)

// Only admins can create, update, and delete gyms
router.post("/", requireRole("admin"), createGym)
router.patch("/:id", requireRole("admin"), updateGym)
router.delete("/:id", requireRole("admin"), deleteGym)

export default router
