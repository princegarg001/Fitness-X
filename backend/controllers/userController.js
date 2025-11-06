import User from "../models/User.js"

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).populate("gym")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { displayName, bio, profilePhoto } = req.body

    const user = await User.findOneAndUpdate({ uid: req.user.uid }, { displayName, bio, profilePhoto }, { new: true })

    res.json({ user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const enrollFace = async (req, res) => {
  try {
    const { embedding } = req.body

    if (!embedding || !Array.isArray(embedding)) {
      return res.status(400).json({ error: "Invalid embedding" })
    }

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        $push: {
          faceTemplates: {
            embedding,
            capturedAt: new Date(),
          },
        },
      },
      { new: true },
    )

    res.json({
      message: "Face template saved",
      templatesCount: user.faceTemplates.length,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const verifyFace = async (req, res) => {
  try {
    const { embedding } = req.body

    const user = await User.findOne({ uid: req.user.uid })

    if (!user || user.faceTemplates.length === 0) {
      return res.status(400).json({ error: "No face templates enrolled" })
    }

    // Simple distance-based matching
    let bestMatch = null
    let minDistance = Number.POSITIVE_INFINITY
    const threshold = 0.6

    for (const template of user.faceTemplates) {
      let distance = 0
      for (let i = 0; i < embedding.length; i++) {
        distance += Math.pow(embedding[i] - template.embedding[i], 2)
      }
      distance = Math.sqrt(distance)

      if (distance < minDistance) {
        minDistance = distance
        bestMatch = template
      }
    }

    const matched = minDistance <= threshold

    res.json({
      matched,
      distance: minDistance,
      threshold,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const listUsers = async (req, res) => {
  try {
    const { role, limit = 50, skip = 0 } = req.query

    const query = role ? { role } : {}
    const users = await User.find(query)
      .select("-faceTemplates")
      .limit(Number.parseInt(limit))
      .skip(Number.parseInt(skip))
      .populate("gym")

    const total = await User.countDocuments(query)

    res.json({ users, total, limit: Number.parseInt(limit), skip: Number.parseInt(skip) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const assignRole = async (req, res) => {
  try {
    const { role } = req.body

    if (!["admin", "trainer", "member"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" })
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ message: `User role updated to ${role}`, user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
