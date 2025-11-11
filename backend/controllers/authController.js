import User from "../models/User.js"
import SessionEvent from "../models/SessionEvent.js"

export const signUp = async (req, res) => {
  try {
    const { uid, email, displayName } = req.body

    let user = await User.findOne({ uid })

    if (user) {
      return res.status(400).json({ error: "User already exists" })
    }

    user = new User({
      uid,
      email,
      displayName,
      role: "member",
    })

    await user.save()

    await SessionEvent.create({
      userId: user._id,
      eventType: "login",
      metadata: { action: "signup" },
    })

    res.status(201).json({
      user: {
        id: user._id,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { uid, email } = req.body

    let user = await User.findOne({ uid })

    if (!user) {
      // This prevents overwriting manually created admin/trainer accounts
      user = new User({
        uid,
        email,
        role: "member", // Default role for new signups only
      })
      await user.save()
    }

    console.log("[v0] Login successful for user:", user.email, "with role:", user.role)

    await SessionEvent.create({
      userId: user._id,
      eventType: "login",
    })

    res.json({
      user: {
        id: user._id,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const logout = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })

    if (user) {
      await SessionEvent.create({
        userId: user._id,
        eventType: "logout",
      })
    }

    res.json({ message: "Logged out successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
