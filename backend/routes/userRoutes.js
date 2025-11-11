import express from "express"
import {
  getCurrentUser,
  updateProfile,
  assignRole,
  listUsers,
  deleteUser,
  assignTrainerToMember,
  removeTrainerFromMember,
  getAssignedMembers, // Import getAssignedMembers function
} from "../controllers/userController.js"
import { requireRole } from "../middleware/rbac.js"

const router = express.Router()

// All authenticated users
router.get("/me", getCurrentUser)
router.patch("/me", updateProfile)

// Trainer-only: get assigned members
router.get("/trainer/members", requireRole("trainer"), getAssignedMembers) // Add route for trainer to get their assigned members

// Admin-only: manage users and roles
router.get("/", requireRole("admin"), listUsers)
router.patch("/:id/role", requireRole("admin"), assignRole)
router.delete("/:id", requireRole("admin"), deleteUser)
// Admin-only: manage trainers
router.patch("/:id/assign-trainer", requireRole("admin"), assignTrainerToMember)
router.patch("/:id/remove-trainer", requireRole("admin"), removeTrainerFromMember)

export default router
