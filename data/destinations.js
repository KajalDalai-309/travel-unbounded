export const destinations = [
  {
    id: 1, name: "Kerala", country: "India",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop",
    description: "Cruise through emerald backwaters, lush tea gardens, and pristine beaches. Kerala is nature most serene canvas.",
    price: 24999, category: "india", duration: "6 Days / 5 Nights",
    highlights: ["Alleppey Backwaters", "Munnar Tea Estates", "Kovalam Beach"],
  },
  {
    id: 2, name: "Himachal Pradesh", country: "India",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    description: "Snow-capped peaks, apple orchards, and adventure trails. Himachal beckons with its raw Himalayan grandeur.",
    price: 19999, category: "india", duration: "7 Days / 6 Nights",
    highlights: ["Manali", "Shimla", "Spiti Valley"],
  },
  {
    id: 3, name: "Ladakh", country: "India",
    image: "https://images.unsplash.com/photo-1575472671540-7c0f0d2dfbf9?w=800&auto=format&fit=crop",
    description: "Where the sky meets the earth — monasteries, stark landscapes, and the world highest motor roads await.",
    price: 34999, category: "india", duration: "8 Days / 7 Nights",
    highlights: ["Pangong Lake", "Nubra Valley", "Leh Monastery"],
  },
  {
    id: 4, name: "Andaman", country: "India",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop",
    description: "Crystal-clear turquoise waters, untouched coral reefs, and white sandy beaches — India tropical paradise.",
    price: 29999, category: "india", duration: "6 Days / 5 Nights",
    highlights: ["Havelock Island", "Radhanagar Beach", "Neil Island"],
  },
  {
    id: 5, name: "Goa", country: "India",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop",
    description: "Sun, sand, spice and soul. Goa golden beaches, Portuguese heritage, and vibrant nightlife are legendary.",
    price: 14999, category: "india", duration: "5 Days / 4 Nights",
    highlights: ["Calangute Beach", "Old Goa Churches", "Dudhsagar Falls"],
  },
  {
    id: 6, name: "Kenya", country: "Kenya",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop",
    description: "Witness the Great Migration in the Masai Mara — a primal spectacle of nature that defines the word safari.",
    price: 149999, category: "international", duration: "9 Days / 8 Nights",
    highlights: ["Masai Mara Safari", "Amboseli National Park", "Lake Nakuru"],
  },
  {
    id: 7, name: "Vietnam", country: "Vietnam",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop",
    description: "Sail through limestone karsts of Ha Long Bay, explore ancient Hoi An lantern streets, and taste pho at dawn.",
    price: 79999, category: "international", duration: "10 Days / 9 Nights",
    highlights: ["Ha Long Bay Cruise", "Hoi An Ancient Town", "Hanoi Old Quarter"],
  },
  {
    id: 8, name: "Tanzania", country: "Tanzania",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&auto=format&fit=crop",
    description: "The Serengeti, Ngorongoro Crater, and Zanzibar beaches — Tanzania is Africa at its most magnificent.",
    price: 179999, category: "international", duration: "12 Days / 11 Nights",
    highlights: ["Serengeti Safari", "Ngorongoro Crater", "Zanzibar Beach"],
  },
  {
    id: 9, name: "Iceland", country: "Iceland",
    image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&auto=format&fit=crop",
    description: "Chase the Northern Lights, trek past roaring waterfalls, and soak in geothermal hot springs under the midnight sun.",
    price: 199999, category: "international", duration: "8 Days / 7 Nights",
    highlights: ["Northern Lights", "Golden Circle", "Blue Lagoon"],
  },
  {
    id: 10, name: "Sri Lanka", country: "Sri Lanka",
    image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800&auto=format&fit=crop",
    description: "Tea plantations rolling across misty hills, ancient temples, elephant sanctuaries, and turquoise beaches.",
    price: 49999, category: "international", duration: "7 Days / 6 Nights",
    highlights: ["Sigiriya Rock Fortress", "Ella Tea Trails", "Yala National Park"],
  },
];
export const indiaDestinations = destinations.filter((d) => d.category === "india");
export const internationalDestinations = destinations.filter((d) => d.category === "international");
