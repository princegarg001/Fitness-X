"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/providers/auth-provider"
import { api } from "@/lib/api-client"
import { AlertCircle } from "lucide-react"

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setError(err.message || "Failed to log workout")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Card className="bg-card border-border p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Exercise Name</label>
            <Input
              type="text"
              placeholder="e.g., Morning Run"
              value={formData.exerciseName}
              onChange={(e) => setFormData({ ...formData, exerciseName: e.target.value })}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Duration (minutes)</label>
              <Input
                type="number"
                placeholder="45"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Calories Burned</label>
              <Input
                type="number"
                placeholder="520"
                value={formData.caloriesBurned}
                onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground"
            >
              <option value="cardio">Cardio</option>
              <option value="strength">Strength</option>
              <option value="flexibility">Flexibility</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Sets</label>
              <Input
                type="number"
                placeholder="4"
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Reps</label>
              <Input
                type="number"
                placeholder="12"
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Weight (lbs)</label>
              <Input
                type="number"
                placeholder="225"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
            <textarea
              placeholder="Add any notes about your workout..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground"
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            {loading ? "Logging..." : submitted ? "✓ Workout Logged!" : "Log Workout"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
