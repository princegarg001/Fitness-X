import Tip from "../models/Tip.js"

export const getRandomTip = async (req, res) => {
  try {
    const { category } = req.query

    const filter = { isActive: true }
    if (category && category !== "all") {
      filter.category = category
    }

    const count = await Tip.countDocuments(filter)
    if (count === 0) {
      return res.json({ tip: null, message: "No tips available" })
    }

    const random = Math.floor(Math.random() * count)
    const tip = await Tip.findOne(filter).skip(random)

    res.json({ tip })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getAllTips = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query

    const filter = { isActive: true }
    if (category && category !== "all") {
      filter.category = category
    }

    const tips = await Tip.find(filter).limit(Number.parseInt(limit)).sort({ createdAt: -1 })

    res.json({ tips, total: tips.length })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createTip = async (req, res) => {
  try {
    const { content, category } = req.body

    if (!content) {
      return res.status(400).json({ error: "Content is required" })
    }

    const tip = new Tip({
      content,
      category: category || "general",
    })

    await tip.save()
    res.status(201).json({ tip })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteTip = async (req, res) => {
  try {
    const { id } = req.params

    await Tip.findByIdAndDelete(id)
    res.json({ message: "Tip deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateTip = async (req, res) => {
  try {
    const { id } = req.params
    const { content, category, isActive } = req.body

    const tip = await Tip.findByIdAndUpdate(
      id,
      { content, category, isActive },
      { new: true, runValidators: true },
    )

    if (!tip) {
      return res.status(404).json({ error: "Tip not found" })
    }

    res.json({ tip })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
