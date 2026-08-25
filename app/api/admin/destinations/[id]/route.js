import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Destination from "@/models/Destination";
import { verifyAdminToken, unauthorized } from "@/lib/auth";

export async function PUT(request, context) {
  const payload = await verifyAdminToken(request);
  if (!payload) return unauthorized();
  try {
    await connectDB();
    const params = await Promise.resolve(context?.params);
    const id = params?.id;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const body = await request.json();
    const destination = await Destination.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, destination });
  } catch (error) {
    console.error("PUT destination error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const payload = await verifyAdminToken(request);
  if (!payload) return unauthorized();
  try {
    await connectDB();
    const params = await Promise.resolve(context?.params);
    const id = params?.id;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const deleted = await Destination.findByIdAndDelete(id);
    if (!deleted) {
      // Also try deleting by custom query in case of string ID match
      await Destination.deleteOne({ $or: [{ _id: id }, { name: id }] });
    }
    return NextResponse.json({ success: true, message: "Destination deleted" });
  } catch (error) {
    console.error("DELETE destination error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}