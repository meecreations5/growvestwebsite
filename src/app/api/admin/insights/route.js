import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../lib/server/adminAuth";
import { createInsight, listInsights } from "../../../lib/server/insightsRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../lib/server/requestSecurity";
import { notifyInsightWorkflow } from "../../../lib/server/insightNotifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "insights.read");
    const { searchParams } = new URL(request.url);
    const result = await listInsights({
      status: searchParams.get("status") || "all",
      search: searchParams.get("search") || "",
      page: Number(searchParams.get("page") || 1),
      pageSize: Math.min(100, Number(searchParams.get("pageSize") || 20)),
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load Insights." }, { status: error?.status || 500 });
  }
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "insights.create");
    const body = await readJsonBody(request, 400_000);
    const post = await createInsight(body, admin);
    const notification = await notifyInsightWorkflow({ post, previousStatus: null, actor: admin });
    revalidateTag("growvest-guide-sources");
    return NextResponse.json({ post, notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to create the Insight." }, { status: error?.status || 500 });
  }
}
