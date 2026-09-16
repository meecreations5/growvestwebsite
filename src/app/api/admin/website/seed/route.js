import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { previewWebsiteContentImport, seedWebsiteContent } from "../../../../lib/server/websiteContentRepository";
import { previewInsightsImport, seedInsightsContent } from "../../../../lib/server/insightsRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const admin = await requireAdminRequest(request, "website.read");
    const url = new URL(request.url);
    const force = url.searchParams.get("force") === "true";
    const [website, insights] = await Promise.all([
      previewWebsiteContentImport({ force }),
      previewInsightsImport({ force }),
    ]);
    return NextResponse.json({ ok: true, actor: admin.email, preview: { website, insights } });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to preview the content import." }, { status: error?.status || 500 });
  }
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "website.publish");
    const body = await readJsonBody(request, 5_000).catch(() => ({}));
    const force = Boolean(body?.force);
    const website = await seedWebsiteContent(admin, { force });
    const insights = await seedInsightsContent(admin, { force });
    return NextResponse.json({ ok: true, result: { website, insights } });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to import approved GrowVest content." }, { status: error?.status || 500 });
  }
}
