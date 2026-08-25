"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

function FormattedText({ text }) {
  if (!text) return null;

  // Split lines and format
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 text-[13px] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Section Headers
        if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
          const title = trimmed.replace(/^#+\s*/, "");
          return (
            <p key={idx} className="font-bold text-amber-300 text-sm mt-3 mb-1 pb-0.5 border-b border-white/10">
              {title}
            </p>
          );
        }

        // Bullet points
        if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = trimmed.replace(/^[•\-\*]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-amber-400 select-none text-xs mt-0.5">•</span>
              <span className="flex-1">{renderBoldText(content)}</span>
            </div>
          );
        }

        // Itinerary Days (📍 Day 1, etc.)
        if (trimmed.startsWith("📍") || trimmed.startsWith("🗓️") || trimmed.startsWith("✈️") || trimmed.startsWith("💰")) {
          return (
            <p key={idx} className="font-bold text-white text-[13px] mt-2 mb-0.5">
              {renderBoldText(trimmed)}
            </p>
          );
        }

        return <p key={idx}>{renderBoldText(line)}</p>;
      })}
    </div>
  );
}

function renderBoldText(text) {
  // Helper to parse **bold** parts
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-amber-200">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-2 flex-shrink-0 text-xs font-black text-white mt-1 shadow-md shadow-amber-500/20">
          AI
        </div>
      )}
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-md ${
          isUser
            ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-br-sm text-[13px] font-medium"
            : "bg-[#141d33] text-slate-100 rounded-bl-sm border border-white/10"
        }`}
      >
        {isUser ? <p className="whitespace-pre-wrap">{msg.content}</p> : <FormattedText text={msg.content} />}
      </div>
    </div>
  );
}

const WELCOME_MSG = {
  role: "assistant",
  content: "👋 Namaste! I am your AI Travel Planner from Travel Unbounded!\n\nTell me where you want to go, your travel dates, budget, or preferred vibe, and I will craft a handcrafted day-wise itinerary for you! ✈️",
};

export default function ChatWidget() {
  const pathname = usePathname();
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
        { role: "assistant", content: data.reply || "Sorry, I could not generate a response. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please check your internet and try again." },
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

  // Hide widget inside Admin portal
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] bg-[#0a0f1e] border border-white/15 rounded-2xl shadow-2xl shadow-black/80 flex flex-col transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ height: "560px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md shadow-amber-500/30">
              AI
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-wide">AI Travel Planner</p>
              <p className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                Live · Powered by Groq LLaMA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={clearChat}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
              title="Reset conversation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
              title="Close chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scroll-smooth">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black text-white shadow-md">
                AI
              </div>
              <div className="bg-[#141d33] border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/10 flex-shrink-0 bg-slate-900/40">
          <div className="flex items-end gap-2 bg-[#141d33] border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/30 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="e.g. Plan a 4-day Goa trip under ₹30,000..."
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm resize-none focus:outline-none max-h-24 leading-relaxed"
              style={{ minHeight: "22px" }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 disabled:opacity-30 transition-all shadow-md disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-500 mt-2">
            Ask for day-by-day itineraries, hotels, budgets, or travel advice ✈️
          </p>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-2xl shadow-2xl shadow-amber-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-amber-300/30"
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
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0a0f1e] animate-pulse" />
        )}
      </button>
    </>
  );
}