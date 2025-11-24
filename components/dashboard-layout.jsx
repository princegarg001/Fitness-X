"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"
import { Dumbbell, History, Home, LogOut, MapPin, Menu, MessageSquare, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminDashboard from "./admin-dashboard"
import AIChatbot from "./ai-chatbot"
import DashboardView from "./dashboard-view"
import GymFinder from "./gym-finder"
import LeaderboardView from "./leaderboard-view"
import MemberTrainingView from "./member-training-view"
import TrainerDashboard from "./trainer-dashboard"
import WorkoutForm from "./workout-form"
import WorkoutHistoryView from "./workout-history-view"

export default function DashboardLayout() {
  const { user, token, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!token || !user) {
        setLoading(false)
        return
      }

      try {
        const response = await api.users.getCurrentUser(token)
        console.log("[v0] User profile:", response.user)
        console.log("[v0] User role:", response.user.role)
        setUserRole(response.user.role)
      } catch (error) {
        console.error("[v0] Error fetching user role:", error)
        setUserRole("member") // Default to member if fetch fails
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [token, user])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const getSidebarItems = () => {
    const baseItems = [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "workouts", label: "Log Workout", icon: Dumbbell },
      { id: "gyms", label: "Find Gyms", icon: MapPin },
      { id: "chatbot", label: "AI Coach", icon: MessageSquare },
    ]

    if (userRole === "admin") {
      return [{ id: "dashboard", label: "Admin Dashboard", icon: Home }]
    }

    if (userRole === "trainer") {
      return [
        { id: "dashboard", label: "My Dashboard", icon: Home },
        { id: "chatbot", label: "AI Coach", icon: MessageSquare },
      ]
    }

    // member role
    return [
      ...baseItems,
      { id: "training", label: "Training Programs", icon: Trophy },
      { id: "leaderboard", label: "Leaderboard", icon: Trophy },
      { id: "workout-history", label: "Workout History", icon: History },
    ]
  }

  const sidebarItems = getSidebarItems()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
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
              <span className="text-xs bg-primary/10 px-2 py-1 rounded text-primary font-medium">{userRole}</span>
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
            {sidebarItems.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === item.id ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {userRole === "admin" && activeTab === "dashboard" && <AdminDashboard />}
            {userRole === "trainer" && activeTab === "dashboard" && <TrainerDashboard />}
            {userRole === "member" && activeTab === "dashboard" && <DashboardView />}

            {activeTab === "training" && userRole === "member" && <MemberTrainingView />}

            {activeTab === "workouts" && userRole === "member" && <WorkoutForm />}
            {activeTab === "gyms" && userRole === "member" && <GymFinder />}
            {activeTab === "chatbot" && <AIChatbot user={user} />}
            {activeTab === "leaderboard" && userRole === "member" && <LeaderboardView />}
            {activeTab === "workout-history" && userRole === "member" && <WorkoutHistoryView />}

            {!user && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading user information...</p>
              </div>
            )}
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
