import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

// Allowed hotel categories
const ALLOWED_HOTEL_CATEGORIES = ["Standard", "Deluxe", "Luxury"];

// Email regex
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// Server-side validation
function validateEnquiry(data) {
  const errors = [];

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push("Full name is required (minimum 2 characters)");
  }
  if (!data.email || !EMAIL_REGEX.test(data.email)) {
    errors.push("A valid email address is required");
  }
  if (!data.countryCode || !data.countryCode.trim()) {
    errors.push("Country code is required");
  }
  if (!data.contactNumber || data.contactNumber.trim().length < 6) {
    errors.push("A valid contact number is required");
  }
  if (!data.dateOfTravel) {
    errors.push("Date of travel is required");
  } else {
    const travelDate = new Date(data.dateOfTravel);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (travelDate <= today) {
      errors.push("Date of travel must be a future date");
    }
  }
  if (!data.numberOfPeople || Number(data.numberOfPeople) < 1) {
    errors.push("Number of people must be at least 1");
  }
  if (!data.hotelCategory || !ALLOWED_HOTEL_CATEGORIES.includes(data.hotelCategory)) {
    errors.push("Hotel category must be Standard, Deluxe, or Luxury");
  }
  if (data.numberOfChildren !== undefined && Number(data.numberOfChildren) < 0) {
    errors.push("Number of children cannot be negative");
  }

  return errors;
}

// POST /api/enquiry - Submit enquiry
export async function POST(request) {
  try {
    const body = await request.json();

    // Server-side validation
    const errors = validateEnquiry(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: errors[0], errors },
        { status: 400 }
      );
    }

    // Connect to DB
    await connectDB();

    // Create enquiry
    const enquiry = await Enquiry.create({
      fullName: body.fullName.trim(),
      countryCode: body.countryCode.trim(),
      contactNumber: body.contactNumber.trim(),
      email: body.email.trim().toLowerCase(),
      dateOfTravel: new Date(body.dateOfTravel),
      numberOfPeople: Number(body.numberOfPeople),
      hotelCategory: body.hotelCategory,
      numberOfChildren: Number(body.numberOfChildren) || 0,
      destination: body.destination?.trim() || "",
      message: body.message?.trim() || "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully! Our travel expert will contact you within 24 hours.",
        data: { id: enquiry._id, createdAt: enquiry.createdAt },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enquiry API Error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, message: messages[0], errors: messages },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

// GET /api/enquiry - Fetch all enquiries (admin use)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const [enquiries, total] = await Promise.all([
      Enquiry.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Enquiry.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: enquiries,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET Enquiries Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enquiries." },
      { status: 500 }
    );
  }
}
