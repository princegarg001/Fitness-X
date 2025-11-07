import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import workoutRoutes from "./routes/workoutRoutes.js"
import gymRoutes from "./routes/gymRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import chatbotRoutes from "./routes/chatbotRoutes.js"
import { errorMiddleware } from "./middleware/errorMiddleware.js"
import { authMiddleware } from "./middleware/authMiddleware.js"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", authMiddleware, userRoutes)
app.use("/api/workouts", authMiddleware, workoutRoutes)
app.use("/api/gyms", authMiddleware, gymRoutes)
app.use("/api/analytics", authMiddleware, analyticsRoutes)
app.use("/api/chat", authMiddleware, chatbotRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorMiddleware)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
