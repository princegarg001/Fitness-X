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
    const { memberId, exerciseName, category, duration, caloriesBurned, sets, reps, weight, notes, dueDate } = req.body
    const trainer = await User.findOne({ uid: req.user.uid })

    // Validate required fields
    if (!memberId || !exerciseName || !duration || !caloriesBurned || !dueDate) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Create a new assigned workout with detailed fields
    const workout = new Workout({
      userId: memberId, // Assigned to the member
      trainerId: trainer._id,
      exerciseName,
      category: category || "other",
      duration: Number.parseInt(duration),
      caloriesBurned: Number.parseInt(caloriesBurned),
      sets: sets ? Number.parseInt(sets) : undefined,
      reps: reps ? Number.parseInt(reps) : undefined,
      weight: weight ? Number.parseInt(weight) : undefined,
      notes,
      dueDate: new Date(dueDate),
      isAssigned: true,
    })

    await workout.save()

    await SessionEvent.create({
      userId: trainer._id,
      eventType: "workout_assigned",
      metadata: { workoutId: workout._id, memberId, exerciseName },
    })

    res.json({ workout })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getAssignedWorkouts = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })
    const { limit = 20, skip = 0 } = req.query

    let query = {}
    if (user.role === "trainer") {
      // Trainers see workouts they assigned to members
      query = {
        trainerId: user._id,
        isAssigned: true,
      }
    } else {
      // Members see workouts assigned to them
      query = {
        userId: user._id,
        isAssigned: true,
      }
    }

    const assignedWorkouts = await Workout.find(query)
      .sort({ createdAt: -1 })
      .limit(Number.parseInt(limit))
      .skip(Number.parseInt(skip))
      .populate("userId", "displayName email")
      .populate("trainerId", "displayName email")

    const total = await Workout.countDocuments(query)

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

    await User.findByIdAndUpdate(user._id, {
      $inc: {
        "stats.totalWorkouts": 1,
        "stats.totalCalories": workout.caloriesBurned,
        "stats.totalDuration": workout.duration,
      },
    })

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
