"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Users, CheckCircle, Clock, Zap } from "lucide-react"

export default function TrainerDashboard() {
  const { token } = useAuth()
  const [members, setMembers] = useState([])
  const [assignedWorkouts, setAssignedWorkouts] = useState([])
  const [stats, setStats] = useState({ totalMembers: 0, completedWorkouts: 0, pendingWorkouts: 0 })
  const [loading, setLoading] = useState(true)
  const [assignData, setAssignData] = useState({
    memberId: "",
    exerciseName: "",
    duration: "",
    caloriesBurned: "",
    category: "cardio",
    sets: "",
    reps: "",
    weight: "",
    notes: "",
    dueDate: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return
      try {
        const membersResp = await api.users.getAssignedMembers(token)
        const members = membersResp.members || []
        setMembers(members)

        const workoutsResp = await api.workouts.getAssignedWorkouts(token)
        const workouts = workoutsResp.assignedWorkouts || []
        setAssignedWorkouts(workouts)

        const completed = workouts.filter((w) => w.isCompleted).length
        const pending = workouts.filter((w) => !w.isCompleted).length

        setStats({
          totalMembers: members.length,
          completedWorkouts: completed,
          pendingWorkouts: pending,
        })
      } catch (error) {
        console.error("Error fetching trainer data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const handleAssignWorkout = async () => {
    if (
      !assignData.memberId ||
      !assignData.exerciseName ||
      !assignData.duration ||
      !assignData.caloriesBurned ||
      !assignData.dueDate
    ) {
      alert("Please fill in all required fields")
      return
    }

    try {
      await api.workouts.assignWorkout(
        {
          memberId: assignData.memberId,
          exerciseName: assignData.exerciseName,
          duration: Number.parseInt(assignData.duration),
          caloriesBurned: Number.parseInt(assignData.caloriesBurned),
          category: assignData.category,
          sets: assignData.sets ? Number.parseInt(assignData.sets) : undefined,
          reps: assignData.reps ? Number.parseInt(assignData.reps) : undefined,
          weight: assignData.weight ? Number.parseInt(assignData.weight) : undefined,
          notes: assignData.notes,
          dueDate: assignData.dueDate,
        },
        token,
      )

      setAssignData({
        memberId: "",
        exerciseName: "",
        duration: "",
        caloriesBurned: "",
        category: "cardio",
        sets: "",
        reps: "",
        weight: "",
        notes: "",
        dueDate: "",
      })
      alert("Workout assigned successfully!")

      const workoutsResp = await api.workouts.getAssignedWorkouts(token)
      const workouts = workoutsResp.assignedWorkouts || []
      setAssignedWorkouts(workouts)
    } catch (error) {
      console.error("Error assigning workout:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading trainer dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Trainer Dashboard</h2>
        <p className="text-muted-foreground">Manage your members and training programs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              My Members
              <Users className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">Assigned members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Completed
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedWorkouts}</div>
            <p className="text-xs text-muted-foreground">Workouts completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Pending
              <Clock className="w-4 h-4 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingWorkouts}</div>
            <p className="text-xs text-muted-foreground">Workouts pending</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assign New Workout</CardTitle>
          <CardDescription>Create a workout program for your members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Select Member *</label>
                <select
                  className="w-full mt-2 px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                  value={assignData.memberId}
                  onChange={(e) => setAssignData({ ...assignData, memberId: e.target.value })}
                >
                  <option value="">Choose a member...</option>
                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.displayName} ({member.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Exercise Name *</label>
                <Input
                  type="text"
                  placeholder="e.g., Running, Bench Press"
                  value={assignData.exerciseName}
                  onChange={(e) => setAssignData({ ...assignData, exerciseName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Category *</label>
                <select
                  className="w-full mt-2 px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                  value={assignData.category}
                  onChange={(e) => setAssignData({ ...assignData, category: e.target.value })}
                >
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Duration (minutes) *</label>
                <Input
                  type="number"
                  placeholder="30"
                  value={assignData.duration}
                  onChange={(e) => setAssignData({ ...assignData, duration: e.target.value })}
                  min="1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Calories Burned *</label>
                <Input
                  type="number"
                  placeholder="250"
                  value={assignData.caloriesBurned}
                  onChange={(e) => setAssignData({ ...assignData, caloriesBurned: e.target.value })}
                  min="1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Sets</label>
                <Input
                  type="number"
                  placeholder="3"
                  value={assignData.sets}
                  onChange={(e) => setAssignData({ ...assignData, sets: e.target.value })}
                  min="1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Reps</label>
                <Input
                  type="number"
                  placeholder="10"
                  value={assignData.reps}
                  onChange={(e) => setAssignData({ ...assignData, reps: e.target.value })}
                  min="1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Weight (lbs)</label>
                <Input
                  type="number"
                  placeholder="135"
                  value={assignData.weight}
                  onChange={(e) => setAssignData({ ...assignData, weight: e.target.value })}
                  min="1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Due Date *</label>
                <Input
                  type="date"
                  value={assignData.dueDate}
                  onChange={(e) => setAssignData({ ...assignData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea
                className="w-full mt-2 px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="How should they do this exercise? Any observations?"
                value={assignData.notes}
                onChange={(e) => setAssignData({ ...assignData, notes: e.target.value })}
                rows={4}
              />
            </div>

            <Button onClick={handleAssignWorkout} className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Assign Workout
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Workouts</CardTitle>
          <CardDescription>Track workouts assigned to your members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Exercise</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedWorkouts.length > 0 ? (
                  assignedWorkouts.map((workout) => (
                    <TableRow key={workout._id}>
                      <TableCell className="font-medium">{workout.userId?.displayName || "N/A"}</TableCell>
                      <TableCell>{workout.exerciseName}</TableCell>
                      <TableCell>{workout.dueDate ? new Date(workout.dueDate).toLocaleDateString() : "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={workout.isCompleted ? "default" : "secondary"}>
                          {workout.isCompleted ? "Completed" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center text-muted-foreground py-8">
                      No workouts assigned yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
