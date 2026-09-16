import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getInsightById, publishDueScheduledInsights } from "../../../lib/server/insightsRepository";
import { notifyInsightWorkflow } from "../../../lib/server/insightNotifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validSecret(request) {
  const expected = process.env.CRON_SECRET || "";
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request) {
  if (!validSecret(request)) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  try {
    const result = await publishDueScheduledInsights();
    const notifications = [];
    for (const item of result.publishedPosts || []) {
      const post = await getInsightById(item.id);
      if (post) notifications.push(await notifyInsightWorkflow({ post, previousStatus: "scheduled", actor: { uid: "cron", displayName: "GrowVest Scheduler", email: "" } }));
    }
    return NextResponse.json({ ok: true, ...result, notifications, checkedAt: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to publish scheduled Insights." }, { status: 500 });
  }
}
