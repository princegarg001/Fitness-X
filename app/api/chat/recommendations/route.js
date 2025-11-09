import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // ✅ Verify Firebase Token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, userName } = await req.json();

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content:
              "You are a personalized fitness & nutrition expert. Ask clarifying questions if needed and give structured answers.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("🔥 OpenAI Raw:", data);

    // ✅ Extract text correctly
    const recommendation =
      data?.output_text?.trim() ||
      data?.output?.[0]?.content?.[0]?.text?.trim() ||
      "Sorry, I couldn't generate advicee. Try again.";

    return NextResponse.json({ recommendation });
  } catch (err) {
    console.error("Chat API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
