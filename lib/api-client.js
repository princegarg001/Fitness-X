const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function apiCall(endpoint, options = {}) {
  const { token, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers || {})

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  headers.set("Content-Type", "application/json")

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...fetchOptions,
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "API error")
    }

    return response.json()
  } catch (error) {
    console.error("[v0] API Error:", error.message)
    throw error
  }
}

export const api = {
  auth: {
    signup: (data, token) => apiCall("/auth/signup", { method: "POST", body: JSON.stringify(data), token }),
    login: (data, token) => apiCall("/auth/login", { method: "POST", body: JSON.stringify(data), token }),
    logout: (token) => apiCall("/auth/logout", { method: "POST", token }),
  },
  users: {
    getCurrentUser: (token) => apiCall("/users/me", { token }),
    updateProfile: (data, token) => apiCall("/users/me", { method: "PATCH", body: JSON.stringify(data), token }),
    listUsers: (token, role = null, limit = 50, skip = 0) =>
      apiCall(`/users?${role ? `role=${role}&` : ""}limit=${limit}&skip=${skip}`, { token }),
    assignRole: (userId, role, token) =>
      apiCall(`/users/${userId}`, { method: "PATCH", body: JSON.stringify({ role }), token }),
    deleteUser: (userId, token) => apiCall(`/users/${userId}`, { method: "DELETE", token }),
    assignTrainerToMember: (memberId, trainerId, token) =>
      apiCall(`/users/${memberId}/assign-trainer`, {
        method: "PATCH",
        body: JSON.stringify({ memberId, trainerId }),
        token,
      }),
    removeTrainerFromMember: (memberId, token) =>
      apiCall(`/users/${memberId}/remove-trainer`, { method: "PATCH", body: JSON.stringify({ memberId }), token }),
    getAssignedMembers: (token) => apiCall("/users/trainer/members", { token }),
  },
  workouts: {
    create: (data, token) => apiCall("/workouts", { method: "POST", body: JSON.stringify(data), token }),
    listWorkouts: (token, limit = 20, skip = 0) => apiCall(`/workouts?limit=${limit}&skip=${skip}`, { token }),
    getStats: (token) => apiCall("/workouts/stats/breakdown", { token }),
    assignWorkout: (data, token) => apiCall(`/workouts/assign`, { method: "POST", body: JSON.stringify(data), token }),
    getAssignedWorkouts: (token, limit = 20, skip = 0) =>
      apiCall(`/workouts/assigned?limit=${limit}&skip=${skip}`, { token }),
    completeWorkout: (workoutId, data, token) =>
      apiCall(`/workouts/${workoutId}/complete`, { method: "PATCH", body: JSON.stringify(data), token }),
  },
  gyms: {
    getNearby: (lat, lng, km, token) => apiCall(`/gyms/near?lat=${lat}&lng=${lng}&km=${km}`, { token }),
    getAll: (token) => apiCall("/gyms", { token }),
    getDetails: (id, token) => apiCall(`/gyms/${id}`, { token }),
  },
  analytics: {
    getLeaderboard: (period, token) => apiCall(`/analytics/leaderboard?period=${period}`, { token }),
    getActiveUsers: (days, token) => apiCall(`/analytics/active-users?days=${days}`, { token }),
    getUserStats: (token) => apiCall("/analytics/user-stats", { token }),
    getWeeklyActivity: (token) => apiCall("/analytics/weekly-activity", { token }),
    getExerciseBreakdown: (token) => apiCall("/analytics/exercise-breakdown", { token }),
  },
  tips: {
    getRandomTip: (token, category = "all") => apiCall(`/tips/random?category=${category}`, { token }),
    getAllTips: (token, category = "all", limit = 10) =>
      apiCall(`/tips?category=${category}&limit=${limit}`, { token }),
    createTip: (data, token) => apiCall("/tips", { method: "POST", body: JSON.stringify(data), token }),
    updateTip: (id, data, token) => apiCall(`/tips/${id}`, { method: "PATCH", body: JSON.stringify(data), token }),
    deleteTip: (id, token) => apiCall(`/tips/${id}`, { method: "DELETE", token }),
  },
}
