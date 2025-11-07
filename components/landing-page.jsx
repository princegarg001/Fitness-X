"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Users, Target, TrendingUp } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-primary/10 p-4 rounded-lg">
              <Dumbbell className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 text-balance">
            Your Complete Fitness Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Track workouts, find gyms, connect with trainers, and achieve your fitness goals with intelligent tracking
            and community support.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => router.push("/signup")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/login")}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-balance">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Track Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Log your exercises, monitor progress, and analyze performance over time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Find Gyms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Discover nearby gyms, view facilities, and enroll with face recognition technology.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Target className="w-8 h-8 text-primary mb-4" />
                <CardTitle>AI Coach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get personalized workout recommendations and training tips from our AI assistant.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Compete with friends and stay motivated through community challenges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-primary/10 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Fitness?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of fitness enthusiasts and start your transformation today.
          </p>
          <Button size="lg" onClick={() => router.push("/signup")}>
            Create Your Account
          </Button>
        </div>
      </section>
    </div>
  )
}
