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
    enrollFace: (embedding, token) =>
      apiCall("/users/face/enroll", { method: "POST", body: JSON.stringify({ embedding }), token }),
    verifyFace: (embedding, token) =>
      apiCall("/users/face/verify", { method: "POST", body: JSON.stringify({ embedding }), token }),
  },
  workouts: {
    create: (data, token) => apiCall("/workouts", { method: "POST", body: JSON.stringify(data), token }),
    list: (token, limit = 20, skip = 0) => apiCall(`/workouts?limit=${limit}&skip=${skip}`, { token }),
    getStats: (token) => apiCall("/workouts/stats/breakdown", { token }),
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
  },
}
