"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Globe, Navigation, AlertCircle, Loader, ArrowRight } from "lucide-react"

export default function GymFinder() {
  const { token } = useAuth()
  const [gyms, setGyms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const [locationPermission, setLocationPermission] = useState(false)

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setUserLocation({ lat: latitude, lng: longitude })
            setLocationPermission(true)
            fetchNearbyGyms(latitude, longitude)
            console.log("[v0] User location obtained:", latitude, longitude)
          },
          (error) => {
            console.log("[v0] Geolocation error:", error.message)
            setLocationPermission(false)
            const defaultLat = 40.7128
            const defaultLng = -74.006
            setUserLocation({ lat: defaultLat, lng: defaultLng })
            fetchNearbyGyms(defaultLat, defaultLng)
          },
        )
      } else {
        console.log("[v0] Geolocation not supported")
        setError("Geolocation is not supported by your browser")
      }
    }
    getLocation()
  }, [])

  const fetchNearbyGyms = async (lat, lng) => {
    if (!token) {
      setError("Not authenticated")
      return
    }

    setLoading(true)
    setError("")
    try {
      console.log("[v0] Fetching gyms for coordinates:", lat, lng)
      const response = await api.gyms.getNearby(lat, lng, 10, token)
      console.log("[v0] Gyms fetched:", response.gyms)
      setGyms(response.gyms || [])
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch gyms"
      setError(errorMessage)
      console.error("[v0] Gym fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    if (userLocation) {
      fetchNearbyGyms(userLocation.lat, userLocation.lng)
    }
  }

  const getDirections = (gym) => {
    if (!userLocation) {
      setError("User location not available")
      return
    }
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${gym.location.coordinates[1]},${gym.location.coordinates[0]}`
    window.open(mapsUrl, "_blank")
  }

  const viewOnMap = (gym) => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(gym.name)}/@${gym.location.coordinates[1]},${gym.location.coordinates[0]},15z`
    window.open(mapsUrl, "_blank")
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Find Gyms Near You</CardTitle>
          <CardDescription>Discover fitness centers around your location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Your Location</p>
                <p className="text-sm font-medium text-foreground">
                  {userLocation
                    ? `${userLocation.lat.toFixed(4)}°N, ${Math.abs(userLocation.lng).toFixed(4)}°W`
                    : "Detecting location..."}
                </p>
                {locationPermission && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Location access granted</p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                "Refresh"
              )}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Error</p>
                <p className="text-sm text-red-600/80 dark:text-red-400/80">{error}</p>
              </div>
            </div>
          )}

          {loading && gyms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Finding nearby gyms...</p>
            </div>
          )}

          {gyms.length === 0 && !loading && !error && (
            <div className="text-center py-16 space-y-3">
              <MapPin className="w-12 h-12 mx-auto opacity-30" />
              <p className="text-muted-foreground">No gyms found in your area</p>
              <p className="text-xs text-muted-foreground">Try refreshing or checking a different location</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gyms.map((gym, index) => (
              <Card
                key={gym._id || index}
                className="bg-secondary/5 border-secondary/20 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <CardContent className="pt-6 space-y-4">
                  {/* Gym Header */}
                  <div>
                    <h3 className="font-semibold text-base text-foreground line-clamp-2">{gym.name}</h3>
                    <div className="flex items-start gap-1 mt-2">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-tight">{gym.address}</p>
                    </div>
                  </div>

                  {/* Distance Display */}
                  {gym.distance && (
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Distance</p>
                      <p className="text-lg font-bold text-primary">{gym.distance.toFixed(1)} km</p>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2">
                    {gym.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a href={`tel:${gym.phone}`} className="text-sm text-primary hover:underline">
                          {gym.phone}
                        </a>
                      </div>
                    )}
                    {gym.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={gym.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline truncate"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Amenities */}
                  {gym.amenities && gym.amenities.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-1">
                        {gym.amenities.slice(0, 3).map((amenity, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-1 bg-secondary/20 text-xs rounded text-foreground"
                          >
                            {amenity}
                          </span>
                        ))}
                        {gym.amenities.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-secondary/20 text-xs rounded text-foreground">
                            +{gym.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="default" size="sm" className="flex-1 gap-1" onClick={() => getDirections(gym)}>
                      <ArrowRight className="w-4 h-4" />
                      Directions
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => viewOnMap(gym)}
                    >
                      <MapPin className="w-4 h-4" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Results Summary */}
          {gyms.length > 0 && (
            <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20 text-center">
              <p className="text-sm text-muted-foreground">
                Found <span className="font-semibold text-foreground">{gyms.length}</span> gym
                {gyms.length !== 1 ? "s" : ""} near you
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
