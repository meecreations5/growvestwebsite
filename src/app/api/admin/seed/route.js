import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../lib/server/adminAuth";
import { seedInsightsContent } from "../../../lib/server/insightsRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "insights.publish");
    const body = await readJsonBody(request, 5_000).catch(() => ({}));
    const result = await seedInsightsContent(admin, { force: Boolean(body?.force) });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to import approved Insights content." }, { status: error?.status || 500 });
  }
}
