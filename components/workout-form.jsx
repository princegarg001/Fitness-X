"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"

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
    <div className="max-w-2xl">
      <Card className="bg-card border-border p-8">
        <form onSubmit={handleSubmit} className="space-y-6"></form>
      </Card>
    </div>
  )
}
