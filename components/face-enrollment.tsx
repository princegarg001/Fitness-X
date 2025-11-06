"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { api } from "@/lib/api-client"
import { AlertCircle, CheckCircle, FenceIcon as FaceIcon } from "lucide-react"

export default function FaceEnrollment() {
  const { token } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
        } catch (err: any) {
          setError(err.message || "Failed to enroll face")
        } finally {
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
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="bg-card border-border p-8">
        <div className="text-center mb-8">
          <FaceIcon className="w-16 h-16 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Face Recognition Enrollment</h2>
          <p className="text-muted-foreground">
            Secure your account with biometric authentication for quick check-ins at the gym.
          </p>
        </div>

        {!enrolling && !enrolled && (
          <div className="space-y-4">
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                📸 We'll capture multiple angles of your face to create a secure biometric template. This process takes
                about 2 minutes.
              </p>
            </div>
            <Button
              onClick={handleStartEnrollment}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12"
            >
              Start Enrollment
            </Button>
          </div>
        )}

        {enrolling && (
          <div className="space-y-4">
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-40 border-2 border-accent rounded-2xl opacity-50"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Enrollment Progress</span>
                <span className="text-sm font-semibold text-accent">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground py-2">
              Please look directly at the camera and keep your face within the frame
            </div>

            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full border-border text-foreground hover:bg-secondary/10 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        )}

        {enrolled && (
          <div className="space-y-4 text-center">
            <div className="bg-primary/20 border border-primary/30 rounded-lg p-8">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Enrollment Complete!</h3>
              <p className="text-muted-foreground mb-4">
                Your face has been securely registered. You can now use face recognition for gym check-ins.
              </p>
            </div>
            <Button
              onClick={() => setEnrolled(false)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Back to Dashboard
            </Button>
          </div>
        )}

        {error && (
          <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </Card>

      <Card className="bg-secondary/10 border border-secondary/30 p-6">
        <h3 className="font-semibold text-foreground mb-3">Privacy & Security</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>✓ Your biometric data is encrypted and stored securely</li>
          <li>✓ Face recognition is only used for authentication at your gym</li>
          <li>✓ You can delete your enrollment at any time</li>
          <li>✓ We never share your data with third parties</li>
        </ul>
      </Card>
    </div>
  )
}
