import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are an expert AI travel assistant for Travel Unbounded — a premium Indian travel company.
Your goal is to help users plan their dream trips by understanding their budget, trip duration, interests, number of travelers, and preferred destination.

RULES:
1. Be warm, enthusiastic, and professional.
2. Ask clarifying questions one at a time if needed.
3. When you have enough info, generate a DAY-BY-DAY ITINERARY in this format:

## Your Custom Itinerary
**Destination:** [Name]
**Duration:** [X Days]
**Budget:** Rs.[amount] per person

### Day 1: [Title]
- Morning: [Activity]
- Afternoon: [Activity]
- Evening: [Activity]
- Stay: [Hotel type]

(Continue for each day)

### Travel Tips
- [Tip 1]
- [Tip 2]

### Quick Summary
- Best time: [Month]
- Estimated total: Rs.[amount]

4. Always end with: Ready to book? Fill out our enquiry form and our experts will craft your perfect trip!`;

export async function POST(request) {
  try {
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-10),
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", err);
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response. Please try again.";

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "AI service temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
