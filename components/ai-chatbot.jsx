"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/use-auth"
import { SendHorizontal } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function AIChatbot() {
  const { user, token } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your fitness AI assistant. I can help you with personalized workout recommendations, nutrition tips, and fitness goals. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading || !token) {
      console.log("[v0] Cannot send: input=" + input.trim() + ", loading=" + loading + ", token=" + !!token)
      return
    }

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/chat/recommendations", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: input,
          userId: user?.uid,
          userName: user?.displayName || "User",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.log("[v0] API Error - Status:", response.status, "Data:", errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Response received:", data)

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: data.recommendation || "I'm processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("[v0] Chat error:", error.message)
      const errorMessage = {
        id: messages.length + 2,
        type: "bot",
        content: `Sorry, I encountered an error: ${error.message}. Please make sure you're logged in.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Coach</h2>
          <p className="text-muted-foreground">Get personalized fitness advice</p>
        </div>
        <ThemeToggle />
      </div>
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 shadow-lg rounded-t-lg">
        <h1 className="text-2xl font-bold">Fitness AI Assistant</h1>
        <p className="text-sm opacity-90">Get personalized workout recommendations</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col bg-card border border-border">
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="space-y-4 pr-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <Card
                  className={`max-w-md md:max-w-lg px-4 py-3 ${
                    msg.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/10 text-foreground border-secondary/20"
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                  <span
                    className={`text-xs mt-2 block opacity-70 ${
                      msg.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </Card>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <Card className="bg-secondary/10 text-foreground border-secondary/20 px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                  </div>
                </Card>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2 p-4 border-t border-border">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about workouts, nutrition, or fitness goals..."
            disabled={loading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-primary/90"
            size="icon"
          >
            <SendHorizontal className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
