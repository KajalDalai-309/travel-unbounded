import { NextResponse } from "next/server";
import crypto from "crypto";

function base64urlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64urlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return Buffer.from(str, "base64").toString();
}

export function signToken(payload) {
  const secret = process.env.JWT_SECRET || "fallback-secret";
  const header = base64urlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + 8 * 60 * 60; // 8 hours
  const body = base64urlEncode(JSON.stringify({ ...payload, exp, iat: Math.floor(Date.now() / 1000) }));
  const sig = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token) {
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
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(base64urlDecode(body));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function verifyAdminToken(request) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
