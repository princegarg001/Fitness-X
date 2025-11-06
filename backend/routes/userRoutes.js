import express from "express"
import {
  getCurrentUser,
  updateProfile,
  enrollFace,
  verifyFace,
  assignRole,
  listUsers,
  deleteUser,
} from "../controllers/userController.js"
import { requireRole } from "../middleware/rbac.js"

const router = express.Router()

// All authenticated users
router.get("/me", getCurrentUser)
router.patch("/me", updateProfile)
router.post("/face/enroll", enrollFace)
router.post("/face/verify", verifyFace)

// Admin-only: manage users and roles
router.get("/", requireRole("admin"), listUsers)
router.patch("/:id/role", requireRole("admin"), assignRole)
router.delete("/:id", requireRole("admin"), deleteUser)

export default router
