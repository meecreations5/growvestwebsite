import { NextResponse } from "next/server";
import { getAdminDb } from "../../../lib/server/firebaseAdmin";
import { recordInsightMetric } from "../../../lib/server/insightMetrics";
import { getInsightById, isPublicPost } from "../../../lib/server/insightsRepository";
import { assertAllowedOrigin, enforceRateLimit, readJsonBody } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const db = getAdminDb();
    await enforceRateLimit({ db, request, scope: "insight_metric", limit: 180, windowMs: 60 * 60 * 1000 });
    const body = await readJsonBody(request, 4_000);
    const eventType = ["view", "cta_click", "share"].includes(body?.eventType) ? body.eventType : "";
    const postId = String(body?.postId || "").slice(0, 160);
    const post = await getInsightById(postId);
    if (!post || !isPublicPost(post)) return NextResponse.json({ error: "Insight not found." }, { status: 404 });
    await recordInsightMetric({ postId, eventType });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to record Insight activity." }, { status: error?.status || 500 });
  }
}
