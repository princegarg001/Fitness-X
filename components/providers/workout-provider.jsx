"use client"

import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"
import { createContext, useContext, useEffect, useState } from "react"

const WorkoutContext = createContext({
  workouts: [],
  stats: null,
  loading: false,
  error: null,
  refreshWorkouts: () => {},
  addWorkout: () => {},
})

export function useWorkouts() {
  return useContext(WorkoutContext)
}

export function WorkoutProvider({ children }) {
  const { token } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refreshWorkouts = async () => {
    if (!token) return

    setLoading(true)
    setError(null)
    try {
      const [workoutsData, statsData] = await Promise.all([
        api.workouts.listWorkouts(token, 50, 0),
        api.analytics.getUserStats(token),
      ])

      setWorkouts(workoutsData.workouts || [])
      setStats(statsData.stats || null)
    } catch (err) {
      console.error("Error fetching workouts:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addWorkout = async (workoutData) => {
    if (!token) return

    try {
      const response = await api.workouts.create(workoutData, token)
      setWorkouts((prev) => [response.workout, ...prev])
      await refreshWorkouts() // Refresh stats
      return response.workout
    } catch (err) {
      console.error("Error adding workout:", err)
      throw err
    }
  }

  useEffect(() => {
    if (token) {
      refreshWorkouts()
    }
  }, [token])

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        stats,
        loading,
        error,
        refreshWorkouts,
        addWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  )
}
