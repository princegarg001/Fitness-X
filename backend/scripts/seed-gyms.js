import mongoose from "mongoose"
import dotenv from "dotenv"
import Gym from "../models/Gym.js"

dotenv.config()

const seedGyms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected")

    // Clear existing gyms
    await Gym.deleteMany({})

    const gyms = [
      {
        name: "FitZone Premium",
        address: "123 Fitness Ave",
        city: "New York",
        state: "NY",
        country: "USA",
        zipCode: "10001",
        phone: "+1 (555) 123-4567",
        email: "contact@fitzone.com",
        website: "https://fitzone.com",
        location: {
          type: "Point",
          coordinates: [-74.006, 40.7128],
        },
        amenities: ["Weights", "Cardio", "Pool", "Yoga", "Personal Training"],
        rating: 4.8,
        hours: {
          monday: { open: "5:00 AM", close: "11:00 PM" },
          tuesday: { open: "5:00 AM", close: "11:00 PM" },
          wednesday: { open: "5:00 AM", close: "11:00 PM" },
          thursday: { open: "5:00 AM", close: "11:00 PM" },
          friday: { open: "5:00 AM", close: "11:00 PM" },
          saturday: { open: "6:00 AM", close: "10:00 PM" },
          sunday: { open: "7:00 AM", close: "9:00 PM" },
        },
      },
      {
        name: "Iron House Gym",
        address: "456 Strength St",
        city: "New York",
        state: "NY",
        country: "USA",
        zipCode: "10002",
        phone: "+1 (555) 234-5678",
        email: "contact@ironhouse.com",
        website: "https://ironhouse.com",
        location: {
          type: "Point",
          coordinates: [-73.9857, 40.7306],
        },
        amenities: ["Weights", "CrossFit", "Personal Training", "Nutrition"],
        rating: 4.6,
        hours: {
          monday: { open: "6:00 AM", close: "10:00 PM" },
          tuesday: { open: "6:00 AM", close: "10:00 PM" },
          wednesday: { open: "6:00 AM", close: "10:00 PM" },
          thursday: { open: "6:00 AM", close: "10:00 PM" },
          friday: { open: "6:00 AM", close: "10:00 PM" },
          saturday: { open: "8:00 AM", close: "8:00 PM" },
          sunday: { open: "8:00 AM", close: "8:00 PM" },
        },
      },
      {
        name: "SwiftFit Studio",
        address: "789 Energy Blvd",
        city: "New York",
        state: "NY",
        country: "USA",
        zipCode: "10003",
        phone: "+1 (555) 345-6789",
        email: "contact@swiftfit.com",
        website: "https://swiftfit.com",
        location: {
          type: "Point",
          coordinates: [-74.0025, 40.7589],
        },
        amenities: ["Cardio", "HIIT", "Classes", "Yoga", "Pilates"],
        rating: 4.5,
        hours: {
          monday: { open: "7:00 AM", close: "9:00 PM" },
          tuesday: { open: "7:00 AM", close: "9:00 PM" },
          wednesday: { open: "7:00 AM", close: "9:00 PM" },
          thursday: { open: "7:00 AM", close: "9:00 PM" },
          friday: { open: "7:00 AM", close: "9:00 PM" },
          saturday: { open: "9:00 AM", close: "7:00 PM" },
          sunday: { open: "9:00 AM", close: "7:00 PM" },
        },
      },
    ]

    await Gym.insertMany(gyms)
    console.log("Gyms seeded successfully")

    await mongoose.connection.close()
  } catch (error) {
    console.error("Error seeding gyms:", error)
    process.exit(1)
  }
}

seedGyms()
