import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">TU</span>
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">Travel Unbounded</p>
                <p className="text-amber-400 text-xs font-medium tracking-wider uppercase">Experiential Journeys</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              India&apos;s most trusted experiential travel experts. We build journeys around people, not catalogues.
            </p>
            <div className="flex gap-3">
              {["facebook", "instagram", "twitter", "youtube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/50 border border-white/10 flex items-center justify-center transition-all duration-200 group"
                >
                  <span className="text-slate-400 group-hover:text-amber-400 text-xs font-bold uppercase">
                    {social[0].toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Plan Your Trip" },
                { href: "/#india", label: "India Destinations" },
                { href: "/#international", label: "International" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-amber-500/40 group-hover:bg-amber-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Top Picks</h3>
            <ul className="space-y-3">
              {["Kerala", "Ladakh", "Andaman", "Kenya", "Vietnam", "Iceland"].map((dest) => (
                <li key={dest}>
                  <a
                    href="/#destinations"
                    className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-amber-500/40 group-hover:bg-amber-400 transition-colors" />
                    {dest}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Our Offices</h3>
            <div className="space-y-4">
              {[
                { city: "Bengaluru HQ", addr: "541, 7th Main Rd, Indiranagar, Bengaluru – 560008" },
                { city: "Kochi", addr: "LR Towers, Palavivatton, Kochi – 682025" },
                { city: "Nairobi", addr: "Westpark Towers, Muthithi Road, Nairobi" },
              ].map((office) => (
                <div key={office.city}>
                  <p className="text-amber-400 text-xs font-semibold uppercase tracking-wide mb-1">{office.city}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{office.addr}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Travel Unbounded. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Crafted with love for explorers worldwide 🌍
          </p>
        </div>
      </div>
    </footer>
  );
}
