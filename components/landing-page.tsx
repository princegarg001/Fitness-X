"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dumbbell, MapPin, FenceIcon as FaceIcon } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">FitFlow</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition">
              About
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition">
              Contact
            </a>
          </nav>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="outline" className="text-foreground bg-transparent">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
          Your Personal <span className="text-primary">Fitness</span> Companion
        </h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Track your workouts, find nearby gyms, and unlock advanced features with face recognition. Train smarter,
          achieve more.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Training Now
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-card border-border p-8 hover:border-primary/50 transition">
            <Dumbbell className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2 text-foreground">Workout Tracking</h3>
            <p className="text-muted-foreground">
              Log your exercises, track progress, and monitor your performance over time with detailed analytics.
            </p>
          </Card>
          <Card className="bg-card border-border p-8 hover:border-primary/50 transition">
            <MapPin className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2 text-foreground">Find Gyms</h3>
            <p className="text-muted-foreground">
              Discover nearby gyms with real-time location data. Find the perfect facility for your training needs.
            </p>
          </Card>
          <Card className="bg-card border-border p-8 hover:border-primary/50 transition">
            <FaceIcon className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2 text-foreground">Face Recognition</h3>
            <p className="text-muted-foreground">
              Secure check-in with advanced face recognition technology. Verify your identity instantly.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-lg p-16">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Transform Your Fitness?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of athletes already tracking their progress with FitFlow.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 FitFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
