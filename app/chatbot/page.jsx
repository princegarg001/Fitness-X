"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import AIChatbot from "@/components/ai-chatbot"
import { useEffect } from "react"

export default function ChatbotPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-primary border-t-accent rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!user) return null // while redirecting

  return (
    <div className="min-h-screen bg-background">
      <AIChatbot user={user} />
    </div>
  )
}
