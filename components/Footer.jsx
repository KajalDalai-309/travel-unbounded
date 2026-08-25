"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on all admin portal routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">TU</span>
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">Travel Unbounded</p>
                <p className="text-amber-400 text-xs font-medium tracking-wider uppercase">Experiential Journeys</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              India&apos;s most trusted experiential travel experts. We build journeys around people, not catalogues.
            </p>
            <div className="flex gap-3 pt-2">
              {["F", "I", "T", "Y"].map((social, i) => (
                <span
                  key={i}
                  className="w-9 h-9 rounded-lg bg-slate-800 border border-white/5 flex items-center justify-center text-slate-400 text-xs hover:text-amber-400 hover:border-amber-400/30 transition-colors cursor-pointer"
                >
                  {social}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Plan Your Trip" },
                { href: "/#india-destinations", label: "India Destinations" },
                { href: "/#intl-destinations", label: "International" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Top Picks</h4>
            <ul className="space-y-3">
              {["Kerala", "Ladakh", "Andaman", "Kenya", "Vietnam", "Iceland"].map((place) => (
                <li key={place}>
                  <Link
                    href={`/contact?destination=${encodeURIComponent(place)}`}
                    className="text-slate-400 text-sm hover:text-amber-400 transition-colors"
                  >
                    {place}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Our Offices</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div>
                <p className="text-white font-medium text-xs uppercase tracking-wide text-amber-400">Bengaluru HQ</p>
                <p className="text-xs text-slate-400 mt-0.5">541, 7th Main Rd, Indiranagar, Bengaluru – 560008</p>
              </div>
              <div>
                <p className="text-white font-medium text-xs uppercase tracking-wide text-emerald-400">Kochi</p>
                <p className="text-xs text-slate-400 mt-0.5">LR Towers, Palavivatton, Kochi – 682025</p>
              </div>
              <div>
                <p className="text-white font-medium text-xs uppercase tracking-wide text-blue-400">Nairobi</p>
                <p className="text-xs text-slate-400 mt-0.5">Westpark Towers, Muthithi Road, Nairobi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Travel Unbounded. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/admin/login" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
              Admin Portal
            </Link>
            <p className="text-slate-500 text-xs flex items-center gap-1">
              Crafted with love for explorers worldwide 🌍
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}