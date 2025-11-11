import mongoose from "mongoose"

const workoutSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    exerciseName: { type: String, required: true },
    category: { type: String, enum: ["cardio", "strength", "flexibility", "sports", "other"], required: true },
    duration: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
    sets: Number,
    reps: Number,
    weight: Number,
    notes: String,
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Gym" },
    isAssigned: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    dueDate: Date,
    completedAt: Date,
    completionNotes: String,
    createdAt: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model("Workout", workoutSchema)
