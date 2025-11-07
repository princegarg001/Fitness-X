"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"
import { AlertCircle, Camera, CheckCircle } from "lucide-react"

export default function FaceEnrollment() {
  const { token } = useAuth()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (enrolling && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          setError("Unable to access camera. Please check permissions.")
          console.error("[v0] Camera access error:", err)
          setEnrolling(false)
        })
    }
  }, [enrolling])

  const handleStartEnrollment = () => {
    setEnrolling(true)
    setError("")
    simulateEnrollment()
  }

  const simulateEnrollment = async () => {
    let currentProgress = 0
    const interval = setInterval(async () => {
      currentProgress += Math.random() * 25
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(interval)
        setProgress(100)

        try {
          if (!token) throw new Error("Not authenticated")

          // Simulate face embedding (in production, use face-api.js)
          const mockEmbedding = Array(128)
            .fill(0)
            .map(() => Math.random())

          await api.users.enrollFace(mockEmbedding, token)
          setLoading(false)
          setEnrolled(true)
          setEnrolling(false)
        } catch (err) {
          setError(err.message || "Failed to enroll face")
          setEnrolling(false)
        }
      } else {
        setProgress(currentProgress)
      }
    }, 500)
  }

  const handleCancel = () => {
    setEnrolling(false)
    setProgress(0)
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const handleReset = () => {
    setEnrolled(false)
    setProgress(0)
    setError("")
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Face Enrollment</CardTitle>
          <CardDescription>Enroll your face for secure authentication</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {enrolled && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600">Face successfully enrolled!</span>
            </div>
          )}

          <div className="space-y-6">
            {enrolling ? (
              <>
                <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Enrollment Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                  <Button disabled className="flex-1">
                    {loading ? "Processing..." : "Enrolling..."}
                  </Button>
                </div>
              </>
            ) : enrolled ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="font-semibold text-lg">Enrollment Complete</h3>
                  <p className="text-sm text-muted-foreground mt-2">Your face has been securely registered</p>
                </div>
                <Button onClick={handleReset} variant="outline">
                  Enroll Another Face
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <Camera className="w-16 h-16 text-muted-foreground/50 mx-auto" />
                <div>
                  <h3 className="font-semibold text-lg">Ready to Enroll</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    We'll capture your face data to secure your account
                  </p>
                </div>
                <Button onClick={handleStartEnrollment} className="w-full">
                  Start Enrollment
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-secondary/5 border-secondary/20">
        <CardHeader>
          <CardTitle className="text-base">Privacy & Security</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>✓ Your face data is encrypted and stored securely</p>
          <p>✓ Only used for authentication purposes</p>
          <p>✓ Never shared with third parties</p>
          <p>✓ You can delete your enrollment anytime</p>
        </CardContent>
      </Card>
    </div>
  )
}
