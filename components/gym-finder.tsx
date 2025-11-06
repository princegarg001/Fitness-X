"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { api } from "@/lib/api-client"
import { MapPin, Phone, Clock, Loader } from "lucide-react"

export default function GymFinder() {
  const { token } = useAuth()
  const [gyms, setGyms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

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

  const fetchNearbyGyms = async (lat: number, lng: number) => {
    if (!token) return

    setLoading(true)
    try {
      const response = await api.gyms.getNearby(lat, lng, 5, token)
      setGyms(response.gyms || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch gyms")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Map Placeholder */}
      <Card className="bg-card border-border p-8 h-96 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-accent mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Interactive map would display here with Mapbox</p>
          {userLocation && (
            <p className="text-sm text-muted-foreground mt-2">
              Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          )}
        </div>
      </Card>

      {/* Gyms List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Nearby Gyms</h3>
          {loading && <Loader className="w-5 h-5 text-accent animate-spin" />}
        </div>

        {error && (
          <Card className="bg-destructive/20 border border-destructive/30 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
        )}

        {gyms.length === 0 && !loading && (
          <Card className="bg-secondary/10 border border-secondary/30 p-4">
            <p className="text-sm text-muted-foreground">
              No gyms found in your area. Try expanding your search radius.
            </p>
          </Card>
        )}

        {gyms.map((gym: any) => (
          <Card key={gym._id} className="bg-card border-border p-6 hover:border-primary/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-foreground">{gym.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-accent font-semibold">{gym.rating}</span>
                  <span className="text-muted-foreground">({gym.members?.length || 0} members)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                <span>
                  {gym.address}, {gym.city}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" />
                <span>
                  {gym.hours?.monday?.open || "N/A"} - {gym.hours?.monday?.close || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4" />
                <span>{gym.phone || "N/A"}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {gym.amenities?.map((amenity: string) => (
                <span
                  key={amenity}
                  className="px-3 py-1 bg-secondary/20 border border-secondary/50 rounded-full text-sm text-foreground"
                >
                  {amenity}
                </span>
              ))}
            </div>

            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              View Details & Enroll
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
