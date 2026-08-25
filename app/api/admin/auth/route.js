import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ username, role: "admin" });

    const response = NextResponse.json({ success: true, message: "Login successful" });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
