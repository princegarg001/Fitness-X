import User from "../models/User.js"

export const rbacMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findOne({ uid: req.user.uid })

      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Insufficient permissions" })
      }

      req.userDoc = user
      next()
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
