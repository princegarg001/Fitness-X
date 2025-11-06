import { verifyToken } from "../services/firebaseAdmin.js"
import User from "../models/User.js"

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    const decoded = await verifyToken(token)
    const user = await User.findOne({ uid: decoded.uid })

    if (!user) {
      return res.status(401).json({ error: "User not found" })
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      userId: user._id,
      role: user.role,
    }
    next()
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" })
  }
}
