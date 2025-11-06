import mongoose from "mongoose"

const sessionEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventType: { type: String, enum: ["login", "workout_created", "face_verify", "check_in", "logout"], required: true },
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, index: true },
})

export default mongoose.model("SessionEvent", sessionEventSchema)
