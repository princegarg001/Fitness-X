"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function WorkoutForm() {
  const { token } = useAuth()
  const [formData, setFormData] = useState({
    exerciseName: "",
    duration: "",
    caloriesBurned: "",
    category: "cardio",
    sets: "",
    reps: "",
    weight: "",
    notes: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!token) throw new Error("Not authenticated")

      await api.workouts.create(
        {
          exerciseName: formData.exerciseName,
          duration: Number.parseInt(formData.duration),
          caloriesBurned: Number.parseInt(formData.caloriesBurned),
          category: formData.category,
          sets: formData.sets ? Number.parseInt(formData.sets) : undefined,
          reps: formData.reps ? Number.parseInt(formData.reps) : undefined,
          weight: formData.weight ? Number.parseInt(formData.weight) : undefined,
          notes: formData.notes,
        },
        token,
      )

      setSubmitted(true)
      setTimeout(() => {
        setFormData({
          exerciseName: "",
          duration: "",
          caloriesBurned: "",
          category: "cardio",
          sets: "",
          reps: "",
          weight: "",
          notes: "",
        })
        setSubmitted(false)
      }, 2000)
    } catch (err) {
      setError(err.message || "Failed to log workout")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Log Workout</CardTitle>
          <CardDescription>Record your exercise session</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600">Workout logged successfully!</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Exercise Name *</label>
                <Input
                  type="text"
                  name="exerciseName"
                  value={formData.exerciseName}
                  onChange={handleChange}
                  placeholder="e.g., Running, Bench Press"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration (minutes) *</label>
                <Input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="30"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Calories Burned *</label>
                <Input
                  type="number"
                  name="caloriesBurned"
                  value={formData.caloriesBurned}
                  onChange={handleChange}
                  placeholder="250"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sets</label>
                <Input
                  type="number"
                  name="sets"
                  value={formData.sets}
                  onChange={handleChange}
                  placeholder="3"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reps</label>
                <Input
                  type="number"
                  name="reps"
                  value={formData.reps}
                  onChange={handleChange}
                  placeholder="10"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Weight (lbs)</label>
                <Input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="135"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="How did you feel? Any observations?"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground min-h-24"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Logging..." : "Log Workout"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
