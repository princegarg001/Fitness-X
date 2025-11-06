const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface ApiOptions extends RequestInit {
  token?: string
}

export async function apiCall(endpoint: string, options: ApiOptions = {}): Promise<any> {
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
  } catch (error: any) {
    console.error("[v0] API Error:", error.message)
    throw error
  }
}

export const api = {
  auth: {
    signup: (data: any, token: string) =>
      apiCall("/auth/signup", { method: "POST", body: JSON.stringify(data), token }),
    login: (data: any, token: string) => apiCall("/auth/login", { method: "POST", body: JSON.stringify(data), token }),
    logout: (token: string) => apiCall("/auth/logout", { method: "POST", token }),
  },
  users: {
    getCurrentUser: (token: string) => apiCall("/users/me", { token }),
    updateProfile: (data: any, token: string) =>
      apiCall("/users/me", { method: "PATCH", body: JSON.stringify(data), token }),
    enrollFace: (embedding: number[], token: string) =>
      apiCall("/users/face/enroll", { method: "POST", body: JSON.stringify({ embedding }), token }),
    verifyFace: (embedding: number[], token: string) =>
      apiCall("/users/face/verify", { method: "POST", body: JSON.stringify({ embedding }), token }),
  },
  workouts: {
    create: (data: any, token: string) => apiCall("/workouts", { method: "POST", body: JSON.stringify(data), token }),
    list: (token: string, limit = 20, skip = 0) => apiCall(`/workouts?limit=${limit}&skip=${skip}`, { token }),
    getStats: (token: string) => apiCall("/workouts/stats/breakdown", { token }),
  },
  gyms: {
    getNearby: (lat: number, lng: number, km: number, token: string) =>
      apiCall(`/gyms/near?lat=${lat}&lng=${lng}&km=${km}`, { token }),
    getAll: (token: string) => apiCall("/gyms", { token }),
    getDetails: (id: string, token: string) => apiCall(`/gyms/${id}`, { token }),
  },
  analytics: {
    getLeaderboard: (period: string, token: string) => apiCall(`/analytics/leaderboard?period=${period}`, { token }),
    getActiveUsers: (days: number, token: string) => apiCall(`/analytics/active-users?days=${days}`, { token }),
    getUserStats: (token: string) => apiCall("/analytics/user-stats", { token }),
  },
}
