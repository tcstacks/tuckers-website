import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "tucker-admin-session";
const SESSION_VALUE = "tucker-personal-website-admin-v1";

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function hasAdminConfig(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function getAdminSessionToken(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  return createHmac("sha256", secret).update(SESSION_VALUE).digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected && safeEqual(password, expected));
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = getAdminSessionToken();
  if (!expected) return false;
  const actual = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(actual && safeEqual(actual, expected));
}
