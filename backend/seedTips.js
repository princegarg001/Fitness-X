import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import Tip from "./models/Tip.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, ".env") })

const tips = [
  {
    content: "Every workout is progress. Celebrate the small victories!",
    category: "motivation",
  },
  {
    content: "Consistency beats perfection. Show up, even on tough days.",
    category: "motivation",
  },
  {
    content: "Your only competition is who you were yesterday.",
    category: "motivation",
  },
  {
    content: "Drink water before, during, and after your workout to stay hydrated.",
    category: "nutrition",
  },
  {
    content: "Protein after workouts helps rebuild and repair muscles.",
    category: "nutrition",
  },
  {
    content: "Eat a balanced meal with carbs and protein within 2 hours post-workout.",
    category: "nutrition",
  },
  {
    content: "Warm up for 5-10 minutes before intense exercise to prevent injuries.",
    category: "workout",
  },
  {
    content: "Focus on form over weight. Quality reps build strength safely.",
    category: "workout",
  },
  {
    content: "Progressive overload: gradually increase weight, reps, or intensity.",
    category: "workout",
  },
  {
    content: "Rest days are crucial. Your muscles grow during recovery, not during workouts.",
    category: "recovery",
  },
  {
    content: "Aim for 7-9 hours of sleep for optimal muscle recovery and performance.",
    category: "recovery",
  },
  {
    content: "Stretch after workouts to improve flexibility and reduce soreness.",
    category: "recovery",
  },
  {
    content: "Track your workouts to see your progress over time.",
    category: "general",
  },
  {
    content: "Set realistic goals and break them into smaller milestones.",
    category: "general",
  },
  {
    content: "Find a workout buddy or join a community for accountability.",
    category: "general",
  },
  {
    content: "The hardest part is showing up. Once you start, momentum takes over.",
    category: "motivation",
  },
  {
    content: "Don't compare your chapter 1 to someone else's chapter 20.",
    category: "motivation",
  },
  {
    content: "Stay fueled with complex carbs for sustained energy throughout the day.",
    category: "nutrition",
  },
  {
    content: "Include compound exercises like squats, deadlifts, and bench press.",
    category: "workout",
  },
  {
    content: "Listen to your body. Pain is different from discomfort.",
    category: "recovery",
  },
]

async function seedTips() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected")

    // Clear existing tips
    await Tip.deleteMany({})
    console.log("Cleared existing tips")

    // Insert new tips
    await Tip.insertMany(tips)
    console.log(`Successfully seeded ${tips.length} tips`)

    process.exit(0)
  } catch (error) {
    console.error("Error seeding tips:", error)
    process.exit(1)
  }
}

seedTips()
