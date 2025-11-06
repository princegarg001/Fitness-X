import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: String,
    profilePhoto: String,
    role: { type: String, enum: ["admin", "trainer", "member"], default: "member" },
    bio: String,
    gym: { type: mongoose.Schema.Types.ObjectId, ref: "Gym" },
    faceTemplates: [
      {
        embedding: [Number],
        capturedAt: { type: Date, default: Date.now },
      },
    ],
    stats: {
      totalWorkouts: { type: Number, default: 0 },
      totalCalories: { type: Number, default: 0 },
      totalDuration: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model("User", userSchema)
