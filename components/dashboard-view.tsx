"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Activity, Flame, Target, TrendingUp } from "lucide-react"
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

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: Activity, label: "Total Workouts", value: stats.totalWorkouts },
          { icon: Flame, label: "Calories Burned", value: `${stats.totalCalories}` },
          { icon: Target, label: "This Week", value: stats.thisWeek },
          { icon: TrendingUp, label: "Current Streak", value: `${stats.streak} days` },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label} className="bg-card border-border p-6">
            <div className="flex items-center gap-4">
              <Icon className="w-10 h-10 text-accent" />
              <div>
                <p className="text-muted-foreground text-sm">{label}</p>
                <p className="text-2xl font-bold text-foreground">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workoutData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="calories" fill="#5DD4D4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Exercise Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={exerciseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {exerciseBreakdown.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                labelStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Workouts */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Workouts</h3>
        <div className="space-y-3">
          {[
            { name: "Morning Run", duration: 45, calories: 520, time: "2 hours ago" },
            { name: "Chest & Triceps", duration: 60, calories: 380, time: "1 day ago" },
            { name: "Evening Yoga", duration: 30, calories: 180, time: "2 days ago" },
          ].map((workout) => (
            <div
              key={workout.name}
              className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/50"
            >
              <div>
                <p className="font-medium text-foreground">{workout.name}</p>
                <p className="text-sm text-muted-foreground">{workout.time}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-accent">{workout.calories} cal</p>
                <p className="text-sm text-muted-foreground">{workout.duration} min</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Leaderboard */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Leaderboard</h3>
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div
              key={entry.user.id}
              className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/50"
            >
              <div>
                <p className="font-medium text-foreground">{entry.user.name}</p>
                <p className="text-sm text-muted-foreground">{entry.workouts} workouts</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-accent">{entry.calories} cal</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
