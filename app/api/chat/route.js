import { NextResponse } from "next/server";
import https from "https";

const SYSTEM_PROMPT = `You are an expert AI travel assistant for Travel Unbounded, a premium Indian experiential travel company.
Your goal is to help users plan extraordinary journeys across India and international destinations.

Guidelines:
1. Be warm, enthusiastic, courteous, and knowledgeable.
2. If the user mentions a destination, duration, budget, or preferences, craft a clear, exciting DAY-BY-DAY ITINERARY.
3. Structure your response nicely with clean formatting, emojis, budget estimates in INR (₹), and recommended highlights.
4. If details are missing, recommend best seasons, highlights, and ask clarifying questions to tailor their trip.
5. Always remind them that Travel Unbounded specializes in custom handcrafted trips, and encourage them to click "Plan Your Trip" or submit the Enquiry form!`;

function callGroqApi(messages) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-10),
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const req = https.request(
      {
        hostname: "api.groq.com",
        port: 443,
        path: "/openai/v1/chat/completions",
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
        timeout: 20000,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const data = JSON.parse(body);
            if (data.error) {
              reject(new Error(data.error.message || "Groq API error"));
            } else {
              const reply =
                data.choices?.[0]?.message?.content ||
                "I am here to help you plan your next journey with Travel Unbounded!";
              resolve(reply);
            }
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out"));
    });

    req.write(payload);
    req.end();
  });
}

export async function POST(request) {
  try {
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const reply = await callGroqApi(messages);
    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "AI service temporarily busy",
        reply:
          "Namaste! I'd love to help you plan your journey. Could you please share your travel dates, budget, or preferred destinations so I can create a custom itinerary for you?",
      },
      { status: 200 }
    );
  }
}