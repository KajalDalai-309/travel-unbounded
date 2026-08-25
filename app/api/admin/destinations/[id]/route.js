import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Destination from "@/models/Destination";
import { verifyAdminToken, unauthorized } from "@/lib/auth";

export async function PUT(request, { params }) {
  const payload = await verifyAdminToken(request);
  if (!payload) return unauthorized();
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const destination = await Destination.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!destination) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, destination });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const payload = await verifyAdminToken(request);
  if (!payload) return unauthorized();
  try {
    await connectDB();
    const { id } = await params;
    await Destination.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Destination deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}