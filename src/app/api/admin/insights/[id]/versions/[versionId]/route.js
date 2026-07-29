import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../../../lib/server/adminAuth";
import { restoreInsightVersion } from "../../../../../../lib/server/insightsRepository";
import { assertAllowedOrigin } from "../../../../../../lib/server/requestSecurity";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "insights.versions");
    const { id, versionId } = await params;
    const post = await restoreInsightVersion(id, versionId, admin);
    revalidateTag("growvest-guide-sources");
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to restore this version." }, { status: error?.status || 500 });
  }
}
