"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"
import { CheckCircle2, Clock, Dumbbell } from "lucide-react"
import { useEffect, useState } from "react"

export default function MemberTrainingView() {
  const { token } = useAuth()
  const [assignedWorkouts, setAssignedWorkouts] = useState([])
  const [completionNotes, setCompletionNotes] = useState("")
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssignedWorkouts = async () => {
      if (!token) return
      try {
        const response = await api.workouts.getAssignedWorkouts(token)
        const workouts = response.assignedWorkouts || []
        setAssignedWorkouts(workouts)
      } catch (error) {
        console.error("Error fetching assigned workouts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignedWorkouts()
  }, [token])

  const handleCompleteWorkout = async () => {
    if (!selectedWorkout) return

    try {
      await api.workouts.completeWorkout(selectedWorkout._id, { completionNotes }, token)

      setAssignedWorkouts(
        assignedWorkouts.map((w) =>
          w._id === selectedWorkout._id ? { ...w, isCompleted: true, completionNotes, completedAt: new Date() } : w,
        ),
      )

      setSelectedWorkout(null)
      setCompletionNotes("")
    } catch (error) {
      console.error("Error completing workout:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading training programs...</div>
  }

  const pendingWorkouts = assignedWorkouts.filter((w) => !w.isCompleted)
  const completedWorkouts = assignedWorkouts.filter((w) => w.isCompleted)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Training Programs</h2>
          <p className="text-muted-foreground">Track your assigned workouts and training progress</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Pending
              <Clock className="w-4 h-4 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingWorkouts.length}</div>
            <p className="text-xs text-muted-foreground">Workouts to complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Completed
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedWorkouts.length}</div>
            <p className="text-xs text-muted-foreground">Finished workouts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Pending Workouts
          </CardTitle>
          <CardDescription>Workouts assigned to you that need completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exercise</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingWorkouts.length > 0 ? (
                  pendingWorkouts.map((workout) => (
                    <TableRow key={workout._id}>
                      <TableCell className="font-medium">{workout.exerciseName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{workout.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="space-y-1">
                          <div>Duration: {workout.duration} min</div>
                          <div>Calories: {workout.caloriesBurned}</div>
                          {workout.sets && <div>Sets: {workout.sets}</div>}
                          {workout.reps && <div>Reps: {workout.reps}</div>}
                          {workout.weight && <div>Weight: {workout.weight} lbs</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedWorkout(workout)}>
                              Complete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Complete Workout</DialogTitle>
                              <DialogDescription>Mark {workout.exerciseName} as completed</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="bg-card/50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">{workout.exerciseName}</h4>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p>Duration: {workout.duration} minutes</p>
                                  <p>Calories to burn: {workout.caloriesBurned}</p>
                                  {workout.sets && <p>Sets: {workout.sets}</p>}
                                  {workout.reps && <p>Reps: {workout.reps}</p>}
                                  {workout.weight && <p>Weight: {workout.weight} lbs</p>}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Completion Notes (Optional)</label>
                                <Textarea
                                  className="mt-2"
                                  placeholder="How did it go? Any notes or difficulties?"
                                  value={completionNotes}
                                  onChange={(e) => setCompletionNotes(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              <Button onClick={handleCompleteWorkout} className="w-full">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Mark as Completed
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center text-muted-foreground py-8">
                      No pending workouts. Great job staying on top of your training!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {completedWorkouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Completed Workouts
            </CardTitle>
            <CardDescription>Your finished training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exercise</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedWorkouts.map((workout) => (
                    <TableRow key={workout._id}>
                      <TableCell className="font-medium">{workout.exerciseName}</TableCell>
                      <TableCell>
                        <Badge variant="default">{workout.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{new Date(workout.completedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {workout.completionNotes || "No notes"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
