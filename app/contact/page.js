import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";

export const metadata = {
  title: "Plan Your Trip | Travel Enquiry",
  description:
    "Ready to travel? Fill out our enquiry form and our travel expert will design a custom itinerary just for you. Kerala, Ladakh, Kenya, Vietnam and beyond — we plan it all.",
};

const contactInfo = [
  { icon: "📍", label: "Headquarters", value: "541, 7th Main Rd, Indiranagar, Bengaluru – 560008" },
  { icon: "📞", label: "Phone", value: "+91 98765 43210" },
  { icon: "✉️", label: "Email", value: "hello@travelunbounded.com" },
  { icon: "⏰", label: "Response Time", value: "Within 24 hours" },
];

export default function ContactPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-900/80" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            Let&apos;s Get Started
          </span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-5 leading-tight">
            Plan Your{" "}
            <span className="text-gradient">Dream Trip</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Share your travel details below and our expert will craft a personalized itinerary — at no cost to you.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT: Contact Info */}
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-7">
                <h2 className="text-white font-bold text-xl mb-6">Get In Touch</h2>
                <div className="space-y-5">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex gap-4">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">{item.label}</p>
                        <p className="text-slate-200 text-sm font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What happens next */}
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-7">
                <h3 className="text-amber-400 font-bold mb-5">What Happens Next?</h3>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Submit Your Enquiry", desc: "Fill in your travel details above" },
                    { step: "2", title: "Expert Review", desc: "Our travel specialist reviews your requirements" },
                    { step: "3", title: "Custom Itinerary", desc: "We craft a personalized itinerary for you" },
                    { step: "4", title: "Bon Voyage!", desc: "You travel. We handle everything." },
                  ].map((s) => (
                    <div key={s.step} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {s.step}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{s.title}</p>
                        <p className="text-slate-400 text-xs">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offices */}
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-7">
                <h3 className="text-white font-bold mb-5">Our Offices</h3>
                {[
                  { city: "🇮🇳 Bengaluru HQ", addr: "541, 7th Main Rd, Indiranagar" },
                  { city: "🇮🇳 Kochi", addr: "LR Towers, Palavivatton" },
                  { city: "🇰🇪 Nairobi", addr: "Westpark Towers, Muthithi Road" },
                ].map((o) => (
                  <div key={o.city} className="mb-4 last:mb-0">
                    <p className="text-white text-sm font-semibold">{o.city}</p>
                    <p className="text-slate-400 text-xs">{o.addr}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-7 sm:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-xl">
                    ✈️
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">Travel Enquiry Form</h2>
                    <p className="text-slate-400 text-sm">Fields marked <span className="text-red-400">*</span> are required</p>
                  </div>
                </div>
                <Suspense fallback={<div className="text-slate-400 text-sm">Loading form...</div>}>
                  <BookingForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
