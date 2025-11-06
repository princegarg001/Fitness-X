import Workout from "../models/Workout.js"
import User from "../models/User.js"
import SessionEvent from "../models/SessionEvent.js"

export const getCalorieLeaderboard = async (req, res) => {
  try {
    const { period = "week" } = req.query

    const daysBack = period === "week" ? 7 : period === "month" ? 30 : 1
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)

    const leaderboard = await Workout.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalCalories: { $sum: "$caloriesBurned" },
          workoutCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $sort: { totalCalories: -1 },
      },
      {
        $limit: 20,
      },
    ])

    res.json({ leaderboard, period })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getActiveUsers = async (req, res) => {
  try {
    const { days = 7 } = req.query

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(days))

    const activeUsers = await SessionEvent.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          eventType: "login",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    res.json({ activeUsers, days: Number.parseInt(days) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getUserStats = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })

    const stats = {
      totalWorkouts: user.stats.totalWorkouts,
      totalCalories: user.stats.totalCalories,
      totalDuration: user.stats.totalDuration,
      averageCaloriesPerWorkout:
        user.stats.totalWorkouts > 0 ? (user.stats.totalCalories / user.stats.totalWorkouts).toFixed(2) : 0,
      averageDurationPerWorkout:
        user.stats.totalWorkouts > 0 ? (user.stats.totalDuration / user.stats.totalWorkouts).toFixed(2) : 0,
    }

    res.json({ stats })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getGymAnalytics = async (req, res) => {
  try {
    const analytics = await User.aggregate([
      {
        $match: { role: "member" },
      },
      {
        $group: {
          _id: "$gym",
          memberCount: { $sum: 1 },
          totalCaloriesBurned: { $sum: "$stats.totalCalories" },
          totalWorkouts: { $sum: "$stats.totalWorkouts" },
        },
      },
      {
        $lookup: {
          from: "gyms",
          localField: "_id",
          foreignField: "_id",
          as: "gymDetails",
        },
      },
      {
        $unwind: "$gymDetails",
      },
      {
        $sort: { memberCount: -1 },
      },
    ])

    res.json({ analytics })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getTrainerAssignments = async (req, res) => {
  try {
    const trainer = await User.findOne({ uid: req.user.uid })

    if (trainer.role !== "trainer" && trainer.role !== "admin") {
      return res.status(403).json({ error: "Only trainers and admins can view assignments" })
    }

    // For admins, show all assignments; for trainers, show only their assignments
    const query = trainer.role === "admin" ? {} : { assignedTrainer: trainer._id }

    const assignments = await Workout.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "member",
        },
      },
      {
        $unwind: "$member",
      },
      {
        $group: {
          _id: "$userId",
          member: { $first: "$member" },
          workouts: { $push: "$$ROOT" },
          totalAssignments: { $sum: 1 },
        },
      },
      {
        $sort: { totalAssignments: -1 },
      },
    ])

    res.json({ assignments })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
