"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Menu, LogOut, Home, Dumbbell, MapPin, MessageSquare, Trophy } from "lucide-react"
import DashboardView from "./dashboard-view"
import WorkoutForm from "./workout-form"
import GymFinder from "./gym-finder"
import AIChatbot from "./ai-chatbot"
import FaceEnrollment from "./face-enrollment"

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-accent rounded-lg lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Dumbbell className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">FitFlow</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span>{user?.displayName || "User"}</span>
              <span className="text-xs bg-primary/10 px-2 py-1 rounded text-primary font-medium">{user?.role}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`border-r border-border bg-card w-64 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-200 fixed lg:static h-[calc(100vh-68px)] z-30`}
        >
          <nav className="p-6 space-y-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeTab === "dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("workouts")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeTab === "workouts" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"
              }`}
            >
              <Dumbbell className="w-5 h-5" />
              <span className="font-medium">Log Workout</span>
            </button>

            <button
              onClick={() => setActiveTab("gyms")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeTab === "gyms" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Find Gyms</span>
            </button>

            <button
              onClick={() => setActiveTab("chatbot")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeTab === "chatbot" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">AI Coach</span>
            </button>

            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeTab === "leaderboard" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Leaderboard</span>
            </button>

            <div className="pt-6 border-t border-border">
              <button
                onClick={() => setActiveTab("enrollment")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left text-sm ${
                  activeTab === "enrollment"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-muted-foreground"
                }`}
              >
                <span className="font-medium">Face Enrollment</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {activeTab === "dashboard" && <DashboardView />}
            {activeTab === "workouts" && <WorkoutForm />}
            {activeTab === "gyms" && <GymFinder />}
            {activeTab === "chatbot" && <AIChatbot user={user} />}
            {activeTab === "leaderboard" && (
              <Card>
                <CardHeader>
                  <CardTitle>Leaderboard</CardTitle>
                  <CardDescription>Compete with the community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Leaderboard data loading...</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {activeTab === "enrollment" && <FaceEnrollment />}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 lg:hidden z-20 top-[68px]" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
