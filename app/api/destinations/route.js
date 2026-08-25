import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Destination from "@/models/Destination";

// Public API - no auth needed
export async function GET() {
  try {
    await connectDB();
    const destinations = await Destination.find({ isActive: true })
      .sort({ category: 1, price: 1 })
      .lean();
    return NextResponse.json({ success: true, destinations });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}