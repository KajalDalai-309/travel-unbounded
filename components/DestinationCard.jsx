"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DestinationCard({ destination }) {
  const [imgError, setImgError] = useState(false);
  const { name, country, image, description, price, duration, highlights } = destination;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div className="group relative bg-slate-800/50 rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={imgError ? "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop" : image}
          alt={`${name}, ${country}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImgError(true)}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        {/* Country badge */}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20 font-medium">
          {country}
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-semibold">
          {duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-bold text-xl mb-2 group-hover:text-amber-400 transition-colors">{name}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>

        {/* Highlights */}
        {highlights && highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {highlights.slice(0, 3).map((h) => (
              <span key={h} className="text-xs bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-full">
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Starting from</p>
            <p className="text-amber-400 font-bold text-lg">{formattedPrice}</p>
          </div>
          <Link
            href={`/contact?destination=${encodeURIComponent(name)}`}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105"
          >
            Enquire →
          </Link>
        </div>
      </div>
    </div>
  );
}
