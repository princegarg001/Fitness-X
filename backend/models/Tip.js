import mongoose from "mongoose"

const tipSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    category: { type: String, enum: ["motivation", "nutrition", "workout", "recovery", "general"], default: "general" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model("Tip", tipSchema)
