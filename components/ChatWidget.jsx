"use client";
import { useState, useRef, useEffect } from "react";

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-2 flex-shrink-0 text-xs font-bold text-white mt-1">
          AI
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-br-md"
            : "bg-slate-700/80 text-slate-100 rounded-bl-md border border-white/5"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

const WELCOME_MSG = {
  role: "assistant",
  content: "👋 Namaste! I am your AI Travel Planner from Travel Unbounded!\n\nI can help you create a custom day-wise itinerary. Just tell me:\n• 🌍 Where do you want to go? (or I'll suggest!)\n• 📅 How many days?\n• 💰 What's your budget (in ₹)?\n• 👥 How many travelers?\n• 🎯 Your interests (adventure, culture, beaches, food...)\n\nLet's plan your dream trip! ✈️",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sorry, I could not respond. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Connection error. Please check your internet and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages([WELCOME_MSG]);

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-[#0d1424] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ height: "520px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xs">
              AI
            </div>
            <div>
              <p className="text-white font-bold text-sm">AI Travel Planner</p>
              <p className="text-green-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                Online – Powered by Groq AI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={clearChat} className="text-slate-500 hover:text-slate-300 transition-colors p-1" title="Clear chat">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-0 flex-shrink-0 text-xs font-bold text-white">
                AI
              </div>
              <div className="bg-slate-700/80 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-white/5 flex-shrink-0">
          <div className="flex items-end gap-2 bg-slate-800/80 border border-white/10 rounded-xl px-3 py-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me to plan your trip..."
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm resize-none focus:outline-none max-h-20"
              style={{ minHeight: "24px" }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:from-amber-400 hover:to-orange-500 transition-all disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-slate-600 mt-2">Powered by Groq AI · LLaMA 3.3 70B</p>
        </div>
      </div>

      {/* FAB Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-2xl shadow-xl shadow-amber-500/40 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Open AI Travel Planner"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0f1e] animate-pulse" />
        )}
      </button>
    </>
  );
}