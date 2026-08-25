import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Destination from "@/models/Destination";
import { verifyAdminToken, unauthorized } from "@/lib/auth";

export async function GET(request) {
  const payload = await verifyAdminToken(request);
  if (!payload) return unauthorized();
  try {
    await connectDB();
    const destinations = await Destination.find().sort({ category: 1, name: 1 }).lean();
    return NextResponse.json({ success: true, destinations });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const payload = await verifyAdminToken(request);
  if (!payload) return unauthorized();
  try {
    await connectDB();
    const body = await request.json();
    const destination = await Destination.create(body);
    return NextResponse.json({ success: true, destination }, { status: 201 });
  } catch (error) {
    console.error("Create destination error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}