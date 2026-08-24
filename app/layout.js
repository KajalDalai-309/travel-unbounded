import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: "Travel Unbounded | Experiential Travel Experts",
    template: "%s | Travel Unbounded",
  },
  description:
    "India most trusted experiential travel experts. We craft immersive journeys across India, Kenya, Vietnam, Iceland and beyond. Personally-vetted experiences, expert local guides.",
  keywords: ["travel", "India travel", "Kerala tour", "Ladakh trip", "Kenya safari", "experiential travel"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Travel Unbounded",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-900 text-white antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
