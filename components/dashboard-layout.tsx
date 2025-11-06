"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import DashboardView from "./dashboard-view"
import WorkoutForm from "./workout-form"
import GymFinder from "./gym-finder"
import FaceEnrollment from "./face-enrollment"
import { Dumbbell, MapPin, FenceIcon as FaceIcon, LogOut, Menu } from "lucide-react"

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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className={`flex items-center gap-2 ${!sidebarOpen && "hidden"}`}>
            <Dumbbell className="w-6 h-6 text-sidebar-primary" />
            <span className="font-bold text-sidebar-foreground">FitFlow</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground hover:text-sidebar-primary"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: Dumbbell },
            { id: "workouts", label: "Log Workout", icon: Dumbbell },
            { id: "gyms", label: "Find Gyms", icon: MapPin },
            { id: "face", label: "Face Enroll", icon: FaceIcon },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                activeTab === id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20"
              }`}
            >
              <Icon className="w-5 h-5" />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-card border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "workouts" && "Log Workout"}
              {activeTab === "gyms" && "Find Gyms"}
              {activeTab === "face" && "Face Enrollment"}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "workouts" && <WorkoutForm />}
          {activeTab === "gyms" && <GymFinder />}
          {activeTab === "face" && <FaceEnrollment />}
        </div>
      </main>
    </div>
  )
}
