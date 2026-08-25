import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { verifyAdminToken, unauthorized } from "@/lib/auth";

export async function PATCH(request, { params }) {
  const payload = await verifyAdminToken(request);
  if (!payload) return unauthorized();

  try {
    await connectDB();
    const { id } = await params;
    const { status } = await request.json();

    const validStatuses = ["New", "Contacted", "Converted", "Closed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, enquiry });
  } catch (error) {
    console.error("Update enquiry error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const payload = await verifyAdminToken(request);
  if (!payload) return unauthorized();

  try {
    await connectDB();
    const { id } = await params;
    await Enquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Enquiry deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}