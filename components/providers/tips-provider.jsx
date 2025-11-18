"use client"

import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"
import { createContext, useContext, useEffect, useState } from "react"

const TipsContext = createContext({
  currentTip: null,
  allTips: [],
  loading: false,
  error: null,
  fetchRandomTip: () => {},
  fetchAllTips: () => {},
})

export function useTips() {
  return useContext(TipsContext)
}

export function TipsProvider({ children }) {
  const { token } = useAuth()
  const [currentTip, setCurrentTip] = useState(null)
  const [allTips, setAllTips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRandomTip = async (category = "all") => {
    if (!token) return

    setLoading(true)
    setError(null)
    try {
      const response = await api.tips.getRandomTip(token, category)
      setCurrentTip(response.tip)
    } catch (err) {
      console.error("Error fetching tip:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllTips = async (category = "all", limit = 20) => {
    if (!token) return

    setLoading(true)
    setError(null)
    try {
      const response = await api.tips.getAllTips(token, category, limit)
      setAllTips(response.tips || [])
    } catch (err) {
      console.error("Error fetching all tips:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchRandomTip()

      // Auto-rotate tips every 2 minutes
      const interval = setInterval(() => {
        fetchRandomTip()
      }, 120000)

      return () => clearInterval(interval)
    }
  }, [token])

  return (
    <TipsContext.Provider
      value={{
        currentTip,
        allTips,
        loading,
        error,
        fetchRandomTip,
        fetchAllTips,
      }}
    >
      {children}
    </TipsContext.Provider>
  )
}
