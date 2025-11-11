"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Flame, Calendar, Dumbbell } from "lucide-react"

export default function DashboardView() {
  const { token } = useAuth()
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    thisWeek: 0,
    streak: 0,
  })
  const [leaderboard, setLeaderboard] = useState([])
  const [workoutData, setWorkoutData] = useState([])
  const [exerciseBreakdown, setExerciseBreakdown] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return
      try {
        const response = await api.analytics.getUserStats(token)
        setStats({
          totalWorkouts: response.stats.totalWorkouts,
          totalCalories: Math.round(response.stats.totalCalories),
          thisWeek: response.stats.thisWeek,
          streak: response.stats.streak,
        })

        const weeklyData = await api.analytics.getWeeklyActivity(token)
        setWorkoutData(weeklyData.weeklyActivity || [])

        const breakdownData = await api.analytics.getExerciseBreakdown(token)
        setExerciseBreakdown(breakdownData.exerciseBreakdown || [])

        const leaderboardData = await api.analytics.getLeaderboard("week", token)
        setLeaderboard(leaderboardData.leaderboard || [])
      } catch (error) {
        console.error("[v0] Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [token])

  const colors = ["#5DD4D4", "#FFD966", "#FF6B6B", "#A78BFA"]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Workouts
              <Dumbbell className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Calories Burned
              <Flame className="w-4 h-4 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCalories}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              This Week
              <Calendar className="w-4 h-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground">Workouts</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Streak
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.streak}</div>
            <p className="text-xs text-muted-foreground">Days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Workouts and calories this week</CardDescription>
          </CardHeader>
          <CardContent>
            {workoutData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="workouts" fill="#5DD4D4" name="Workouts" />
                  <Bar yAxisId="right" dataKey="calories" fill="#FFD966" name="Calories" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No workout data for this week
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exercise Breakdown</CardTitle>
            <CardDescription>Distribution of exercise types this week</CardDescription>
          </CardHeader>
          <CardContent>
            {exerciseBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={exerciseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {exerciseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No exercise data for this week
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers This Week</CardTitle>
          <CardDescription>Community leaderboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.length > 0 ? (
              leaderboard.slice(0, 5).map((member, index) => (
                <div key={member._id} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-primary/60">#{index + 1}</div>
                    <div>
                      <p className="font-medium">{member.user?.displayName || member.user?.email || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{member.totalCalories || 0} calories burned</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{member.workoutCount || 0} workouts</div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No leaderboard data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
