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

    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - 7)

    const thisWeekWorkouts = await Workout.countDocuments({
      userId: user._id,
      createdAt: { $gte: startOfWeek },
    })

    const allWorkouts = await Workout.find({ userId: user._id }).sort({ createdAt: -1 }).select("createdAt")

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const workoutDates = new Set()
    allWorkouts.forEach((workout) => {
      const workoutDate = new Date(workout.createdAt)
      workoutDate.setHours(0, 0, 0, 0)
      workoutDates.add(workoutDate.getTime())
    })

    const currentDate = new Date(today)
    while (workoutDates.has(currentDate.getTime())) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    }

    const stats = {
      totalWorkouts: user.stats.totalWorkouts,
      totalCalories: user.stats.totalCalories,
      totalDuration: user.stats.totalDuration,
      thisWeek: thisWeekWorkouts,
      streak: streak,
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

export const getWeeklyActivity = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })

    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - 7)

    const workouts = await Workout.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          workouts: { $sum: 1 },
          calories: { $sum: "$caloriesBurned" },
        },
      },
    ])

    const dayMap = { 1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed", 5: "Thu", 6: "Fri", 7: "Sat" }
    const weekData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      day,
      workouts: 0,
      calories: 0,
    }))

    workouts.forEach((item) => {
      const dayName = dayMap[item._id]
      const index = weekData.findIndex((d) => d.day === dayName)
      if (index !== -1) {
        weekData[index].workouts = item.workouts
        weekData[index].calories = Math.round(item.calories)
      }
    })

    res.json({ weeklyActivity: weekData })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getExerciseBreakdown = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })

    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - 7)

    const breakdown = await Workout.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          calories: { $sum: "$caloriesBurned" },
        },
      },
    ])

    const total = breakdown.reduce((sum, item) => sum + item.count, 0)

    const exerciseBreakdown = breakdown.map((item) => ({
      name: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : "Other",
      value: total > 0 ? Math.round((item.count / total) * 100) : 0,
      count: item.count,
      calories: Math.round(item.calories),
    }))

    res.json({ exerciseBreakdown })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
