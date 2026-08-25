import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { verifyAdminToken, unauthorized } from "@/lib/auth";

export async function GET(request) {
  const payload = await verifyAdminToken(request);
  if (!payload) return unauthorized();

  try {
    await connectDB();

    // Total counts by status
    const statusCounts = await Enquiry.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Enquiries over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEnquiries = await Enquiry.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top destinations
    const topDestinations = await Enquiry.aggregate([
      { $match: { destination: { $ne: "" } } },
      { $group: { _id: "$destination", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    const total = await Enquiry.countDocuments();
    const thisMonth = await Enquiry.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    return NextResponse.json({
      success: true,
      total,
      thisMonth,
      statusCounts,
      recentEnquiries,
      topDestinations,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}