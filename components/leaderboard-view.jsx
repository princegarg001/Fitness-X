"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"

export default function LeaderboardView() {
  const { token } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("week")

  useEffect(() => {
    fetchLeaderboard()
  }, [timeframe, token])

  const fetchLeaderboard = async () => {
    if (!token) return

    try {
      setLoading(true)
      const data = await api.analytics.getLeaderboard(timeframe, token)
      console.log("[v0] Leaderboard data:", data)
      setLeaderboard(data.leaderboard || [])
    } catch (error) {
      console.error("[v0] Error fetching leaderboard:", error)
      setLeaderboard([])
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />
    if (index === 2) return <Award className="w-6 h-6 text-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
  }

  const getRankBadge = (index) => {
    if (index === 0) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    if (index === 1) return "bg-gray-400/10 text-gray-400 border-gray-400/20"
    if (index === 2) return "bg-amber-600/10 text-amber-600 border-amber-600/20"
    return "bg-muted text-muted-foreground border-border"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Top performers in the community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                Leaderboard
              </CardTitle>
              <CardDescription>Top performers in the community</CardDescription>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeframe("week")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === "week"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeframe("month")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === "month"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeframe("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.map((member, index) => (
                <div
                  key={member.user?._id || index}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${getRankBadge(index)} ${
                    index < 3 ? "shadow-sm" : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
                    {getRankIcon(index)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {member.user?.displayName || member.user?.email || "Unknown User"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {member.workoutCount || 0} workout{member.workoutCount !== 1 ? "s" : ""} completed
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-bold">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      {member.totalCalories || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">calories burned</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">No leaderboard data available</p>
              <p className="text-sm text-muted-foreground mt-2">Complete workouts to appear on the leaderboard!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
