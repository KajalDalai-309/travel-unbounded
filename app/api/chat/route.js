import { NextResponse } from "next/server";
import https from "https";

const SYSTEM_PROMPT = `You are the expert AI Travel Planner for "Travel Unbounded" — a premier experiential travel company.

FORMATTING RULES (CRITICAL):
1. NEVER output raw HTML tags (e.g. do NOT use <br>, <p>, <span>, <div>, <table>, etc.).
2. NEVER use markdown tables. Tables do not render well in chat bubbles.
3. Use clean, readable bullet points with appropriate emojis.
4. Keep answers neat, elegant, structured, and easy to read.

When generating a Custom Itinerary, format it cleanly like this:

✈️ [Destination Name] – [Duration] Trip
💰 Estimated Budget: ₹[Amount] per person

🗓️ Day-by-Day Itinerary:

📍 Day 1: [Day Title]
• Morning: [Activity]
• Afternoon: [Activity]
• Evening: [Activity & Sunset point]
• Stay: [Recommended stay type/area]

📍 Day 2: [Day Title]
• Morning: [Activity]
• Afternoon: [Activity]
• Evening: [Activity & Dining spot]
• Stay: [Recommended stay type/area]

(continue for remaining days...)

💡 Key Travel Tips:
• Best time to visit: [Months]
• Local delicacies to try: [Food items]
• Pack essentials: [Quick tips]

📋 Next Steps:
Ready to book? Fill out our Enquiry Form (click "Plan Your Trip" above) and our travel curators will customize every detail for you! 🌟`;

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
              let reply =
                data.choices?.[0]?.message?.content ||
                "I am here to help you plan your next journey with Travel Unbounded!";
              
              // Strip any accidental raw HTML tags
              reply = reply
                .replace(/<br\s*[\/]?>/gi, "\n")
                .replace(/<[^>]+>/g, "")
                .replace(/\?\?/g, "–")
                .replace(//g, "");

              resolve(reply.trim());
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
          "Namaste! I would love to help you plan your journey. Could you please share your travel dates, budget, and who you are travelling with so I can craft a custom itinerary for you?",
      },
      { status: 200 }
    );
  }
}