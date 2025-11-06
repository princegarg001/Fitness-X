"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AIChatbot({ user }) {
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
    if (!input.trim() || loading) return

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
      const response = await fetch("/api/chat/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          userId: user.id,
          userName: user.name,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: data.recommendation,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = {
        id: messages.length + 2,
        type: "bot",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Fitness AI Assistant</h1>
        <p className="text-sm opacity-90">Get personalized recommendations</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col p-4 md:p-6">
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4 pr-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <Card
                  className={`max-w-md md:max-w-lg px-4 py-3 ${
                    msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-card text-foreground border-border"
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                  <span
                    className={`text-xs mt-2 block opacity-70 ${msg.type === "user" ? "text-primary-foreground" : ""}`}
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
                <Card className="bg-card text-foreground border-border px-4 py-3">
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
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about workouts, nutrition, or fitness goals..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()} className="bg-primary hover:bg-primary/90">
            {loading ? "..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  )
}
