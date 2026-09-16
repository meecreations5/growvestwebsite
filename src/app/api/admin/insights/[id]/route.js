import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { archiveInsight, getInsightById, updateInsight } from "../../../../lib/server/insightsRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";
import { notifyInsightWorkflow } from "../../../../lib/server/insightNotifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request, "insights.read");
    const { id } = await params;
    const post = await getInsightById(id);
    if (!post) return NextResponse.json({ error: "Insight not found." }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load the Insight." }, { status: error?.status || 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "insights.update");
    const { id } = await params;
    const body = await readJsonBody(request, 400_000);
    const previous = await getInsightById(id);
    const post = await updateInsight(id, body, admin);
    const notification = await notifyInsightWorkflow({ post, previousStatus: previous?.status || null, actor: admin });
    revalidateTag("growvest-guide-sources");
    return NextResponse.json({ post, notification });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update the Insight." }, { status: error?.status || 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "insights.delete");
    const { id } = await params;
    await archiveInsight(id, admin);
    revalidateTag("growvest-guide-sources");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to archive the Insight." }, { status: error?.status || 500 });
  }
}
