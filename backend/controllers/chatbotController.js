import { generateText } from "ai"

export const getRecommendation = async (req, res) => {
  try {
    const { message, userId, userName } = req.body

    if (!message || !userId) {
      return res.status(400).json({ error: "Message and userId are required" })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `You are an expert fitness coach and nutritionist AI assistant for a fitness tracking app. 
      You help members with personalized workout recommendations, nutrition advice, and fitness goal setting.
      Provide practical, actionable advice based on common fitness knowledge.
      Keep responses concise but helpful (2-3 sentences).
      User: ${userName}`,
      prompt: message,
      temperature: 0.7,
      maxTokens: 300,
    })

    res.status(200).json({
      recommendation: text,
      userId,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("Chatbot error:", error)
    res.status(500).json({
      error: "Failed to generate recommendation",
      message: error.message,
    })
  }
}
