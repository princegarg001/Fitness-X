"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"

export default function GymFinder() {
  const { token } = useAuth()
  const [gyms, setGyms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setUserLocation({ lat: latitude, lng: longitude })
            fetchNearbyGyms(latitude, longitude)
          },
          (error) => {
            console.error("[v0] Geolocation error:", error)
            // Use default location
            setUserLocation({ lat: 40.7128, lng: -74.006 })
            fetchNearbyGyms(40.7128, -74.006)
          },
        )
      }
    }
    getLocation()
  }, [])

  const fetchNearbyGyms = async (lat, lng) => {
    if (!token) return

    setLoading(true)
    try {
      const response = await api.gyms.getNearby(lat, lng, 5, token)
      setGyms(response.gyms || [])
    } catch (err) {
      setError(err.message || "Failed to fetch gyms")
    } finally {
      setLoading(false)
    }
  }

  return <div className="space-y-6"></div>
}
