// chatbotController.js
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure .env is loaded BEFORE this file is used
// import "dotenv/config";

console.log("Is Key Loaded:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);

// Initialize client with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);


export const getRecommendation = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Use updated & stable model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", 
      systemInstruction: `
You are a fitness coach and wellness guide.

Format Rules (IMPORTANT):
- DO NOT use bold, italics, or markdown.
- Do NOT use symbols like **, *, _, #.
- Answer in plain text only.

Your responses should be:
- Short, practical, and easy to follow.
- Simple language, no long explanations.
- Provide clear steps.

Rules:
- If the question is not about fitness, workout, diet, habits, muscle gain, weight loss, health:
  Reply exactly: "sorry i can't answer this"
- If user asks about injuries or medical pain:
  Reply exactly: "Please consult a certified medical professional for that."

Example Responses (Plain Text, No Stars):
Workout means doing physical exercises to improve fitness. Start with 20-30 minutes of walking or light training daily.
`
    });

    // Generate response
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    });

    const reply = result.response.text();

    return res.json({ recommendation: reply });

  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({ error: "Failed to generate recommendation" });
  }
};