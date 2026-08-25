import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Destination from "@/models/Destination";

const SEED_DATA = [
  { name: "Kerala", country: "India", category: "india", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop", description: "Cruise through emerald backwaters, lush tea gardens, and pristine beaches.", price: 24999, duration: "6 Days / 5 Nights", highlights: ["Alleppey Backwaters", "Munnar Tea Estates", "Kovalam Beach"] },
  { name: "Himachal Pradesh", country: "India", category: "india", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop", description: "Snow-capped peaks, apple orchards, and adventure trails.", price: 19999, duration: "7 Days / 6 Nights", highlights: ["Manali", "Shimla", "Spiti Valley"] },
  { name: "Ladakh", country: "India", category: "india", image: "https://images.unsplash.com/photo-1575472671540-7c0f0d2dfbf9?w=800&auto=format&fit=crop", description: "Where the sky meets the earth — monasteries, stark landscapes, and the world highest motor roads await.", price: 34999, duration: "8 Days / 7 Nights", highlights: ["Pangong Lake", "Nubra Valley", "Leh Monastery"] },
  { name: "Andaman", country: "India", category: "india", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop", description: "Crystal-clear turquoise waters, untouched coral reefs, and the most pristine beaches in India.", price: 29999, duration: "6 Days / 5 Nights", highlights: ["Havelock Island", "Radhanagar Beach", "Neil Island"] },
  { name: "Goa", country: "India", category: "india", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop", description: "Sun, sand, spice and soul. Goa golden beaches, Portuguese heritage, and vibrant nightlife.", price: 14999, duration: "5 Days / 4 Nights", highlights: ["Calangute Beach", "Old Goa Churches", "Dudhsagar Falls"] },
  { name: "Kenya", country: "Kenya", category: "international", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop", description: "Witness the Great Migration in the Masai Mara — a primal spectacle of millions of wildebeest.", price: 149999, duration: "9 Days / 8 Nights", highlights: ["Masai Mara Safari", "Amboseli National Park", "Lake Nakuru"] },
  { name: "Vietnam", country: "Vietnam", category: "international", image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&auto=format&fit=crop", description: "Sail through limestone karsts of Ha Long Bay, explore ancient Hoi An, and taste Saigon street food.", price: 79999, duration: "10 Days / 9 Nights", highlights: ["Ha Long Bay Cruise", "Hoi An Ancient Town", "Hanoi Old Quarter"] },
  { name: "Tanzania", country: "Tanzania", category: "international", image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop", description: "The Serengeti, Ngorongoro Crater, and Zanzibar beach — Africa most perfect trifecta.", price: 179999, duration: "12 Days / 11 Nights", highlights: ["Serengeti Safari", "Ngorongoro Crater", "Zanzibar Beach"] },
  { name: "Iceland", country: "Iceland", category: "international", image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&auto=format&fit=crop", description: "Chase the Northern Lights, trek past roaring waterfalls, and soak in geothermal hot springs.", price: 199999, duration: "8 Days / 7 Nights", highlights: ["Northern Lights", "Golden Circle", "Blue Lagoon"] },
  { name: "Sri Lanka", country: "Sri Lanka", category: "international", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop", description: "Tea plantations rolling across misty hills, ancient temples, and beaches fringed with palms.", price: 49999, duration: "7 Days / 6 Nights", highlights: ["Sigiriya Rock Fortress", "Ella Tea Trails", "Yala National Park"] },
];

export async function POST() {
  try {
    await connectDB();
    const existing = await Destination.countDocuments();
    if (existing > 0) {
      return NextResponse.json({ message: "Database already seeded", count: existing });
    }
    await Destination.insertMany(SEED_DATA);
    return NextResponse.json({ success: true, message: "Seeded successfully", count: SEED_DATA.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}