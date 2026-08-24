import Link from "next/link";
import DestinationCard from "@/components/DestinationCard";
import { indiaDestinations, internationalDestinations } from "@/data/destinations";

export const metadata = {
  title: "Travel Unbounded | India Most Trusted Experiential Travel Experts",
  description:
    "Discover extraordinary journeys across India and the world with Travel Unbounded. Kerala backwaters, Ladakh mountains, Kenya safari, Vietnam cruise — we craft stories, not itineraries.",
};

const stats = [
  { value: "10,000+", label: "Happy Travelers" },
  { value: "50+", label: "Destinations" },
  { value: "15+", label: "Years Experience" },
  { value: "24/7", label: "Expert Support" },
];

const whyUs = [
  {
    icon: "🌍",
    title: "Personally-Vetted Experiences",
    desc: "Every destination, resort, and activity our team recommends has been personally experienced — no catalogue selling.",
  },
  {
    icon: "🧭",
    title: "Expert Local Guides",
    desc: "Our handpicked local guides bring stories, context, and access that no generic tour can offer.",
  },
  {
    icon: "✏️",
    title: "Custom Itineraries",
    desc: "We design every trip around you — your pace, your interests, your budget. Never off-the-shelf.",
  },
  {
    icon: "📞",
    title: "24×7 Support",
    desc: "From planning to landing back home, our travel experts are just a call away — anytime.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&auto=format&fit=crop')",
          }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            India Most Trusted Travel Experts
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Journeys That{" "}
            <span className="text-gradient">Tell Stories</span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            From the backwaters of Kerala to the Serengeti plains — we craft immersive travel
            experiences built around the people taking them, not a catalogue.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105 text-base"
            >
              Plan Your Trip →
            </Link>
            <Link
              href="#destinations"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 text-base"
            >
              Explore Destinations
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-amber-400">{s.value}</p>
                <p className="text-slate-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-slate-500 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-amber-400/50 to-transparent" />
        </div>
      </section>

      {/* INDIA DESTINATIONS */}
      <section id="india" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14" id="destinations">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
              Discover India
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              India Destinations
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              From the Himalayas to the tropics — India holds a lifetime of wonders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {indiaDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* INTERNATIONAL DESTINATIONS */}
      <section id="international" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
              Go Global
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              International Destinations
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Safari sunrises, Viking waterfalls, tropical temples — the world is closer than you think.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {internationalDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
              The Travel Unbounded Difference
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Why Travelers Choose Us</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="bg-slate-800/50 border border-white/5 hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 group"
              >
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900 border-t border-amber-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-6">✈️</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Tell us your dream, and our experts will craft a journey that feels truly yours.
            No cookie-cutter packages — just real, unforgettable experiences.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-10 py-5 rounded-2xl hover:shadow-2xl hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105 text-lg"
          >
            Start Planning Your Trip →
          </Link>
          <p className="mt-6 text-slate-500 text-sm">Free consultation · No commitment required</p>
        </div>
      </section>
    </>
  );
}
