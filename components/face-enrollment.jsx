"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"

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
        } catch (err) {
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
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="bg-card border-border p-8"></Card>

      <Card className="bg-secondary/10 border border-secondary/30 p-6"></Card>
    </div>
  )
}
