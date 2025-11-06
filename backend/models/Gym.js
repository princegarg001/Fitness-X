import mongoose from "mongoose"

const gymSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: String,
    state: String,
    country: String,
    zipCode: String,
    phone: String,
    email: String,
    website: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    amenities: [String],
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    trainers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

gymSchema.index({ location: "2dsphere" })

export default mongoose.model("Gym", gymSchema)
