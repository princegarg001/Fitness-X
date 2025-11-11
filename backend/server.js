import express from "express"
import cors from "cors"
// --- START: Environment Loading Fix ---
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// 1. Utilities to define __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 2. Explicitly configure dotenv to look for .env in the CURRENT directory (backend)
const backendEnvPath = path.resolve(__dirname, '.env');
console.log("Attempting to load .env from:", backendEnvPath); // Debug Line 1

// Load the environment variables
dotenv.config({ path: backendEnvPath }) 
// --- END: Environment Loading Fix ---

import mongoose from "mongoose"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import workoutRoutes from "./routes/workoutRoutes.js"
import gymRoutes from "./routes/gymRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import chatbotRoutes from "./routes/chatbotRoutes.js"
import { errorMiddleware } from "./middleware/errorMiddleware.js"
import { authMiddleware } from "./middleware/authMiddleware.js"

// --- Debugging for API Key ---
// Debug Line 2: This should now be TRUE if the backend/.env loaded correctly
console.log("Is Key Loaded:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY); 
// -----------------------------

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
// MONGODB_URI is loaded from the backend/.env
mongoose
  .connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true, // Deprecated/Removed in Mongoose 7
    // useUnifiedTopology: true, // Deprecated/Removed in Mongoose 7
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", authMiddleware, userRoutes)
app.use("/api/workouts", authMiddleware, workoutRoutes)
app.use("/api/gyms", authMiddleware, gymRoutes)
app.use("/api/analytics", authMiddleware, analyticsRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Chatbot route
app.use("/api/chat", chatbotRoutes)

// Error handling
app.use(errorMiddleware)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app