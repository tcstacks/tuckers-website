import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../lib/adminAuth";
import {
  isSiteContent,
  readSiteContent,
  writeSiteContent,
} from "../../lib/siteContentServer";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readSiteContent(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!isSiteContent(body)) {
    return NextResponse.json({ error: "Invalid site content" }, { status: 400 });
  }

  try {
    await writeSiteContent(body);
    return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json(
      { error: "The server could not persist the content." },
      { status: 500 },
    );
  }
}
