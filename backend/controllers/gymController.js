import Gym from "../models/Gym.js"
import { findNearbyGyms } from "../services/geoService.js"

export const getNearbyGyms = async (req, res) => {
  try {
    const { lat, lng, km = 5 } = req.query

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude required" })
    }

    console.log(`[v0] Fetching gyms for lat=${lat}, lng=${lng}, km=${km}`)

    const gyms = await findNearbyGyms(Number.parseFloat(lat), Number.parseFloat(lng), Number.parseFloat(km))

    console.log(`[v0] Found ${gyms.length} gyms`)

    res.json({ gyms, count: gyms.length })
  } catch (error) {
    console.error("[v0] Gym fetch error:", error)
    res.status(500).json({ error: error.message })
  }
}

export const getAllGyms = async (req, res) => {
  try {
    const gyms = await Gym.find().populate("members trainers")
    res.json({ gyms, count: gyms.length })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getGymDetails = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id).populate("members trainers")

    if (!gym) {
      return res.status(404).json({ error: "Gym not found" })
    }

    res.json({ gym })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createGym = async (req, res) => {
  try {
    const { name, address, city, state, country, zipCode, coordinates, amenities, hours, phone, website } = req.body

    const gym = new Gym({
      name,
      address,
      city,
      state,
      country,
      zipCode,
      phone,
      website,
      amenities,
      hours,
      location: {
        type: "Point",
        coordinates: [coordinates.lng, coordinates.lat],
      },
    })

    await gym.save()
    res.status(201).json({ gym })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateGym = async (req, res) => {
  try {
    const { name, address, city, state, country, zipCode, coordinates, amenities, hours, phone, website } = req.body

    const updateData = { name, address, city, state, country, zipCode, phone, website, amenities, hours }

    if (coordinates) {
      updateData.location = {
        type: "Point",
        coordinates: [coordinates.lng, coordinates.lat],
      }
    }

    const gym = await Gym.findByIdAndUpdate(req.params.id, updateData, { new: true })

    if (!gym) {
      return res.status(404).json({ error: "Gym not found" })
    }

    res.json({ gym })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteGym = async (req, res) => {
  try {
    const gym = await Gym.findByIdAndDelete(req.params.id)

    if (!gym) {
      return res.status(404).json({ error: "Gym not found" })
    }

    res.json({ message: "Gym deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
