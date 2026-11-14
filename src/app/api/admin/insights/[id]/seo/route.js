import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../../lib/server/adminAuth";
import { updateInsightSeo } from "../../../../../lib/server/insightsRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "seo.manage");
    const { id } = await params;
    const input = await readJsonBody(request, 7000);
    return NextResponse.json({ post: await updateInsightSeo(id, input, admin) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update Insight SEO." }, { status: error?.status || 500 });
  }
}
