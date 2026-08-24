import Link from "next/link";

export const metadata = {
  title: "About Travel Unbounded | Our Story",
  description:
    "Learn about Travel Unbounded — India most trusted experiential travel company. Founded in Bengaluru with offices in Kochi and Nairobi, we design trips that blend comfort, culture, and raw nature.",
};

const offices = [
  {
    city: "Bengaluru",
    tag: "Headquarters",
    flag: "🇮🇳",
    address: "541, 7th Main Rd, HAL 2nd Stage\nIndiranagar, Bengaluru – 560008\nIndia",
    color: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/30",
  },
  {
    city: "Kochi",
    tag: "Kerala Office",
    flag: "🇮🇳",
    address: "LR Towers, S Janatha Road\nPalavivatton, Kochi – 682025\nIndia",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
  },
  {
    city: "Nairobi",
    tag: "Kenya Office",
    flag: "🇰🇪",
    address: "Westpark Towers, Muthithi Road\nNairobi, P.O. Box 6950\nPostal Code 00100, Kenya",
    color: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/30",
  },
];

const values = [
  {
    icon: "🔍",
    title: "Personally-Vetted Experiences",
    desc: "Every destination, resort, and activity we recommend has been personally experienced by our team. We go where real stories are written.",
  },
  {
    icon: "🧭",
    title: "Expert Local Guides",
    desc: "Our handpicked local partners and guides don't just show you places — they show you life. Insider access, authentic culture, real connections.",
  },
  {
    icon: "🎨",
    title: "Fully Custom Itineraries",
    desc: "No two travelers are the same. We design every trip from scratch around your interests, budget, travel style, and travel companions.",
  },
  {
    icon: "🤝",
    title: "24×7 Expert Support",
    desc: "From the moment you reach out to landing back home — our team is available round the clock so you travel with complete peace of mind.",
  },
];

const milestones = [
  { year: "2008", event: "Founded in Bengaluru by a group of passionate travel enthusiasts." },
  { year: "2012", event: "Expanded to East Africa with our Nairobi office, adding Safari experiences." },
  { year: "2015", event: "Opened the Kerala office to serve South India demand. 1,000 happy travelers milestone." },
  { year: "2019", event: "Launched Vietnam and Southeast Asia packages. Featured in Lonely Planet India." },
  { year: "2023", event: "10,000+ travelers served across 50+ destinations worldwide." },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            Our Story
          </span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
            About{" "}
            <span className="text-gradient">Travel Unbounded</span>
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed">
            Born from a simple belief — that the best journeys aren&apos;t sold from a catalogue.
            They&apos;re built around the people taking them.
          </p>
        </div>
      </section>

      {/* COMPANY STORY */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
                Who We Are
              </span>
              <h2 className="text-4xl font-black text-white mb-6">
                India&apos;s Most Trusted Experiential Travel Experts
              </h2>
              <div className="space-y-5 text-slate-300 leading-relaxed text-lg">
                <p>
                  Travel Unbounded was born from a simple belief — that the best journeys aren&apos;t
                  sold from a catalogue. They&apos;re built around the people taking them.
                </p>
                <p>
                  Headquartered in Bangalore with offices in Kerala and Nairobi, we design trips
                  that blend comfort, culture, and raw nature. Every destination, resort, and
                  activity we recommend has been personally experienced by our team.
                </p>
                <p>
                  From spotting the Big Five at dawn in the Masai Mara to cruising Ha Long Bay at
                  sunset — we go where real stories are written, and we bring you along.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-200 hover:scale-105"
                >
                  Plan Your Journey →
                </Link>
              </div>
            </div>

            {/* Image collage */}
            <div className="grid grid-cols-2 gap-3 h-[480px]">
              <div className="row-span-2 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&auto=format&fit=crop"
                  alt="Kenya Safari"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop"
                  alt="Kerala backwaters"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&auto=format&fit=crop"
                  alt="Vietnam Ha Long Bay"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MILESTONES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3 block">Our Journey</span>
            <h2 className="text-4xl font-black text-white">Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/50 via-amber-500/20 to-transparent" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className={`relative flex gap-6 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"} pl-12 sm:pl-0`}>
                    <div className="bg-slate-800/60 border border-white/5 rounded-xl p-5 hover:border-amber-500/30 transition-colors">
                      <span className="text-amber-400 font-bold text-lg">{m.year}</span>
                      <p className="text-slate-300 mt-1 text-sm leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                  <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-900 top-5 shadow-lg shadow-amber-500/50" />
                  <div className="hidden sm:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OFFICE LOCATIONS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
              Find Us
            </span>
            <h2 className="text-4xl font-black text-white">Our Offices</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offices.map((office) => (
              <div
                key={office.city}
                className={`bg-gradient-to-br ${office.color} border ${office.border} rounded-2xl p-7 hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
              >
                <div className="text-4xl mb-4">{office.flag}</div>
                <div className="mb-1">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">{office.tag}</span>
                </div>
                <h3 className="text-white font-bold text-2xl mb-3">{office.city}</h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{office.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
              Our Values
            </span>
            <h2 className="text-4xl font-black text-white">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-slate-800/60 border border-white/5 hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                  {v.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-3 group-hover:text-amber-400 transition-colors">{v.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-500/10 to-slate-900 border-t border-amber-500/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-5">Let&apos;s Build Your Story</h2>
          <p className="text-slate-300 text-lg mb-8">
            Ready to travel beyond the ordinary? Talk to our experts today.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-10 py-4 rounded-xl hover:shadow-2xl hover:shadow-amber-500/40 transition-all duration-200 hover:scale-105"
          >
            Plan Your Trip →
          </Link>
        </div>
      </section>
    </>
  );
}
