"use client";
import { useState } from "react";
import Link from "next/link";

export default function DestinationCard({ destination }) {
  const [imgError, setImgError] = useState(false);
  const { name, country, image, description, price, duration, highlights } = destination;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

  return (
    <div className="group relative bg-[#0d1424] rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/40 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col h-full w-full">
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden shrink-0 bg-slate-800">
        <img
          src={imgError ? "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop" : image}
          alt={`${name}, ${country}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1424] via-transparent to-black/20" />

        {/* Country badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20 font-semibold shadow-md">
          {country}
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 text-xs px-3 py-1 rounded-full font-bold shadow-lg">
          {duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-white font-bold text-xl mb-1.5 group-hover:text-amber-400 transition-colors">
          {name}
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Highlights */}
        {highlights && highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {highlights.slice(0, 3).map((h) => (
              <span
                key={h}
                className="text-[11px] bg-slate-800/80 border border-white/10 text-slate-300 px-2.5 py-0.5 rounded-md font-medium"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3.5 border-t border-white/10 mt-auto">
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Starting from</p>
            <p className="text-amber-400 font-black text-lg">{formattedPrice}</p>
          </div>
          <Link
            href={`/contact?destination=${encodeURIComponent(name)}`}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105"
          >
            Enquire &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}