"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark)
    setIsDark(shouldBeDark)

    if (shouldBeDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)

    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  if (!mounted) {
    return <div className="h-12 w-24" /> // Placeholder to prevent layout shift
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative group h-12 w-24 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-[2px] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105"
      aria-label="Toggle theme"
    >
      <div className="h-full w-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-between px-2 transition-colors duration-300">
        {/* Sun Icon */}
        <div
          className={`transition-all duration-300 ${
            isDark ? "scale-0 opacity-0 rotate-180" : "scale-100 opacity-100 rotate-0"
          }`}
        >
          <Sun className="w-5 h-5 text-yellow-500" />
        </div>

        {/* Moon Icon */}
        <div
          className={`transition-all duration-300 ${
            isDark ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 rotate-180"
          }`}
        >
          <Moon className="w-5 h-5 text-blue-400" />
        </div>

        {/* Sliding Circle */}
        <div
          className={`absolute top-1 w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 shadow-lg transition-all duration-500 ease-in-out ${
            isDark ? "translate-x-[52px]" : "translate-x-0"
          }`}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        </div>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
    </button>
  )
}
