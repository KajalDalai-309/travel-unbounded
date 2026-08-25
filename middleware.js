import { NextResponse } from "next/server";
import crypto from "crypto";

function verifyTokenMiddleware(token) {
  try {
    const secret = process.env.JWT_SECRET || "fallback-secret";
    const [header, body, sig] = token.split(".");
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(`${header}.${body}`)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    if (sig !== expectedSig) return false;
    const payload = JSON.parse(Buffer.from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    return payload.exp >= Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token || !verifyTokenMiddleware(token)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
