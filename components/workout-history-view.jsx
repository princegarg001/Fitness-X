"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"
import { Calendar, Dumbbell, Filter, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

export default function WorkoutHistoryView() {
  const { token } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!token) return
      try {
        const response = await api.workouts.listWorkouts(token, 100, 0)
        setWorkouts(response.workouts || [])
      } catch (error) {
        console.error("Error fetching workouts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [token])

  if (loading) {
    return <div className="text-center py-12">Loading workout history...</div>
  }

  const filteredWorkouts = categoryFilter === "all" ? workouts : workouts.filter((w) => w.category === categoryFilter)

  const totalCalories = filteredWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0)
  const totalDuration = filteredWorkouts.reduce((sum, w) => sum + w.duration, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Workout History</h2>
          <p className="text-muted-foreground">View all your logged workouts</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Workouts
              <Dumbbell className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredWorkouts.length}</div>
            <p className="text-xs text-muted-foreground">Logged sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Calories
              <TrendingUp className="w-4 h-4 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCalories.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Calories burned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Duration
              <Calendar className="w-4 h-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalDuration}</div>
            <p className="text-xs text-muted-foreground">Minutes trained</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                All Workouts
              </CardTitle>
              <CardDescription>Complete history of your logged workouts</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredWorkouts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Exercise</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Calories</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkouts.map((workout) => (
                    <TableRow key={workout._id}>
                      <TableCell className="font-medium">
                        {new Date(workout.date || workout.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{workout.exerciseName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{workout.category}</Badge>
                      </TableCell>
                      <TableCell>{workout.duration} min</TableCell>
                      <TableCell>{workout.caloriesBurned} cal</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="space-y-1">
                          {workout.sets && <div>Sets: {workout.sets}</div>}
                          {workout.reps && <div>Reps: {workout.reps}</div>}
                          {workout.weight && <div>Weight: {workout.weight} lbs</div>}
                          {workout.notes && (
                            <div className="max-w-xs truncate" title={workout.notes}>
                              Notes: {workout.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {categoryFilter === "all"
                ? "No workouts logged yet. Start tracking your fitness journey!"
                : `No ${categoryFilter} workouts found. Try a different category.`}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
