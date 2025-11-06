export const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const User = (await import("../models/User.js")).default
      const user = await User.findOne({ uid: req.user.uid })

      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          error: `Access denied. Required roles: ${allowedRoles.join(", ")}. Your role: ${user.role}`,
        })
      }

      req.userRole = user.role
      req.userId = user._id
      next()
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

// Permission matrix for different roles
export const PERMISSIONS = {
  admin: {
    gyms: ["create", "read", "update", "delete", "manage"],
    users: ["read", "update", "delete", "assign-role"],
    trainers: ["manage", "assign"],
    members: ["manage", "view"],
    analytics: ["full-access"],
  },
  trainer: {
    workouts: ["create", "read", "assign", "update"],
    members: ["assign", "view", "manage"],
    analytics: ["view-assigned"],
  },
  member: {
    workouts: ["create", "read"],
    gyms: ["read", "search"],
    face: ["enroll", "verify"],
    analytics: ["view-own"],
  },
}

export const hasPermission = (role, resource, action) => {
  const rolePermissions = PERMISSIONS[role]
  if (!rolePermissions) return false
  const resourcePermissions = rolePermissions[resource]
  return resourcePermissions && resourcePermissions.includes(action)
}
