import Gym from "../models/Gym.js"

export const findNearbyGyms = async (lat, lng, radiusKm = 5) => {
  try {
    const gyms = await Gym.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: radiusKm * 1000,
        },
      },
    })
      .limit(20)

    return gyms
  } catch (error) {
    throw new Error("Error finding nearby gyms: " + error.message)
  }
}

export default findNearbyGyms
