"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/lib/api-client"

interface User {
  id: string
  uid: string
  email: string
  displayName?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user")
      const storedToken = localStorage.getItem("authToken")

      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser))
          setToken(storedToken)
        } catch {
          localStorage.removeItem("user")
          localStorage.removeItem("authToken")
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const mockToken = `firebase_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Call backend login endpoint
      const response = await api.auth.login({ uid: email, email }, mockToken)

      const userData: User = {
        id: response.user.id,
        uid: response.user.uid,
        email: response.user.email,
        displayName: response.user.displayName,
        role: response.user.role,
      }

      setUser(userData)
      setToken(mockToken)
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("authToken", mockToken)
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string, displayName: string) => {
    setLoading(true)
    try {
      const mockToken = `firebase_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Call backend signup endpoint
      const response = await api.auth.signup({ uid: email, email, displayName }, mockToken)

      const userData: User = {
        id: response.user.id,
        uid: response.user.uid,
        email: response.user.email,
        displayName: response.user.displayName,
        role: response.user.role,
      }

      setUser(userData)
      setToken(mockToken)
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("authToken", mockToken)
    } catch (error) {
      console.error("[v0] Signup error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await api.auth.logout(token)
      }
    } catch (error) {
      console.error("[v0] Logout error:", error)
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem("user")
      localStorage.removeItem("authToken")
    }
  }

  return <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
