import { verifyToken } from "../services/firebaseAdmin.js";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify Firebase token
    const decoded = await verifyToken(token);

    // Try to find the user in MongoDB
    let user = await User.findOne({ uid: decoded.uid });

    // If user does not exist → create a new member record
    if (!user) {
      user = await User.create({
        uid: decoded.uid,
        email: decoded.email || null,
        displayName: decoded.name || "",
        profilePhoto: decoded.picture || "",
        role: "member",                 // ✅ Correct for your schema
      });

      console.log("✅ New MongoDB user created:", user.email);
    }

    // Attach user info to request object
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      userId: user._id,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};
