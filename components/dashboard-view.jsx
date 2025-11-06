"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { api } from "@/lib/api-client"

export default function DashboardView() {
  const { token } = useAuth()
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    thisWeek: 0,
    streak: 0,
  })
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return
      try {
        const response = await api.analytics.getUserStats(token)
        setStats({
          totalWorkouts: response.stats.totalWorkouts,
          totalCalories: Math.round(response.stats.totalCalories),
          thisWeek: Math.floor(response.stats.totalWorkouts / 4),
          streak: 7,
        })

        const leaderboardData = await api.analytics.getLeaderboard("week", token)
        setLeaderboard(leaderboardData.leaderboard)
      } catch (error) {
        console.error("[v0] Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [token])

  const workoutData = [
    { day: "Mon", workouts: 2, calories: 450 },
    { day: "Tue", workouts: 1, calories: 320 },
    { day: "Wed", workouts: 3, calories: 650 },
    { day: "Thu", workouts: 2, calories: 480 },
    { day: "Fri", workouts: 2, calories: 520 },
    { day: "Sat", workouts: 1, calories: 280 },
    { day: "Sun", workouts: 0, calories: 0 },
  ]

  const exerciseBreakdown = [
    { name: "Cardio", value: 40 },
    { name: "Strength", value: 35 },
    { name: "Flexibility", value: 15 },
    { name: "Sports", value: 10 },
  ]

  const colors = ["#5DD4D4", "#FFD966", "#FF6B6B", "#A78BFA"]

  return <div className="space-y-6"></div>
}
