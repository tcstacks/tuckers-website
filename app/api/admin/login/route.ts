import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  getAdminSessionToken,
  hasAdminConfig,
  verifyAdminPassword,
} from "../../../lib/adminAuth";

export async function POST(request: Request) {
  if (!hasAdminConfig()) {
    return NextResponse.json(
      { error: "Admin access is not configured." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = getAdminSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
