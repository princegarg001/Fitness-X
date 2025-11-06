import Workout from "../models/Workout.js"
import User from "../models/User.js"
import SessionEvent from "../models/SessionEvent.js"

export const createWorkout = async (req, res) => {
  try {
    const { exerciseName, category, duration, caloriesBurned, sets, reps, weight, notes, location } = req.body

    const user = await User.findOne({ uid: req.user.uid })

    const workout = new Workout({
      userId: user._id,
      exerciseName,
      category,
      duration,
      caloriesBurned,
      sets,
      reps,
      weight,
      notes,
      location,
    })

    await workout.save()

    // Update user stats
    await User.findByIdAndUpdate(user._id, {
      $inc: {
        "stats.totalWorkouts": 1,
        "stats.totalCalories": caloriesBurned,
        "stats.totalDuration": duration,
      },
    })

    await SessionEvent.create({
      userId: user._id,
      eventType: "workout_created",
      metadata: { exerciseName, category, caloriesBurned },
    })

    res.status(201).json({ workout })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const listWorkouts = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })
    const { limit = 20, skip = 0 } = req.query

    const workouts = await Workout.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(Number.parseInt(limit))
      .skip(Number.parseInt(skip))
      .populate("location")

    const total = await Workout.countDocuments({ userId: user._id })

    res.json({ workouts, total, limit: Number.parseInt(limit), skip: Number.parseInt(skip) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getWorkoutStats = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })

    const stats = await Workout.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: "$category",
          totalDuration: { $sum: "$duration" },
          totalCalories: { $sum: "$caloriesBurned" },
          count: { $sum: 1 },
        },
      },
    ])

    res.json({ stats })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const assignWorkout = async (req, res) => {
  try {
    const { memberId, instructions, dueDate } = req.body
    const trainer = await User.findOne({ uid: req.user.uid })

    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        assignedTrainer: trainer._id,
        assignedTo: memberId,
        instructions,
        dueDate,
        isAssigned: true,
      },
      { new: true },
    )

    await SessionEvent.create({
      userId: trainer._id,
      eventType: "workout_assigned",
      metadata: { workoutId: workout._id, memberId, instructions },
    })

    res.json({ workout })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getAssignedWorkouts = async (req, res) => {
  try {
    const trainer = await User.findOne({ uid: req.user.uid })
    const { limit = 20, skip = 0 } = req.query

    const assignedWorkouts = await Workout.find({ assignedTrainer: trainer._id, isAssigned: true })
      .sort({ dueDate: 1 })
      .limit(Number.parseInt(limit))
      .skip(Number.parseInt(skip))
      .populate("userId", "displayName email")
      .populate("assignedTo", "displayName email")

    const total = await Workout.countDocuments({ assignedTrainer: trainer._id, isAssigned: true })

    res.json({ assignedWorkouts, total, limit: Number.parseInt(limit), skip: Number.parseInt(skip) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const completeWorkout = async (req, res) => {
  try {
    const { completionNotes } = req.body
    const user = await User.findOne({ uid: req.user.uid })

    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        isCompleted: true,
        completedAt: new Date(),
        completionNotes,
      },
      { new: true },
    )

    await SessionEvent.create({
      userId: user._id,
      eventType: "workout_completed",
      metadata: { workoutId: workout._id, completionNotes },
    })

    res.json({ message: "Workout completed", workout })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
