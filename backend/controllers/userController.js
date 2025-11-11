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

export const listUsers = async (req, res) => {
  try {
    const { role, limit = 50, skip = 0 } = req.query

    const query = role ? { role } : {}
    const users = await User.find(query).limit(Number.parseInt(limit)).skip(Number.parseInt(skip)).populate("gym")

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

export const assignTrainerToMember = async (req, res) => {
  try {
    const { memberId, trainerId } = req.body
    const admin = await User.findOne({ uid: req.user.uid })

    if (admin.role !== "admin") {
      return res.status(403).json({ error: "Only admins can assign trainers" })
    }

    const trainer = await User.findById(trainerId)
    if (!trainer || trainer.role !== "trainer") {
      return res.status(400).json({ error: "Invalid trainer selected" })
    }

    const updatedMember = await User.findByIdAndUpdate(
      memberId,
      { assignedTrainer: trainerId },
      { new: true },
    ).populate("assignedTrainer", "displayName email")

    res.json({ message: "Trainer assigned successfully", member: updatedMember })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const removeTrainerFromMember = async (req, res) => {
  try {
    const { memberId } = req.body
    const admin = await User.findOne({ uid: req.user.uid })

    if (admin.role !== "admin") {
      return res.status(403).json({ error: "Only admins can remove trainers" })
    }

    const updatedMember = await User.findByIdAndUpdate(memberId, { assignedTrainer: null }, { new: true })

    res.json({ message: "Trainer removed successfully", member: updatedMember })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getAssignedMembers = async (req, res) => {
  try {
    const trainer = await User.findOne({ uid: req.user.uid })

    if (trainer.role !== "trainer") {
      return res.status(403).json({ error: "Only trainers can view assigned members" })
    }

    const members = await User.find({ assignedTrainer: trainer._id })

    res.json({ members })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
