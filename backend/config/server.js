import express from "express"
import chatbotRoutes from "./routes/chatbotRoutes.js"

const app = express()

app.use("/api/chat", chatbotRoutes)

export default app
