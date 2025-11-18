import mongoose from "mongoose"

const gymSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },

    // Only for nearby search
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

gymSchema.index({ location: "2dsphere" })

export default mongoose.model("Gym", gymSchema)
