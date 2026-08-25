import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { verifyAdminToken, unauthorized } from "@/lib/auth";

export async function GET(request) {
  const payload = await verifyAdminToken(request);
  if (!payload) return unauthorized();

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query = {};
    if (status && status !== "all") query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, enquiries, total, page, limit });
  } catch (error) {
    console.error("Get enquiries error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
