"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import LandingPage from "@/components/landing-page"
import DashboardLayout from "@/components/dashboard-layout"

export default function Page() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-primary border-t-accent rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return <DashboardLayout />
}
