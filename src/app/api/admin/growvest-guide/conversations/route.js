import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { listGuideConversations, listUnansweredGuideQuestions } from "../../../../lib/server/growvestGuideRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "guide.conversations");
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "";
    const [items, unanswered] = await Promise.all([
      listGuideConversations({ status, limit: 200 }),
      listUnansweredGuideQuestions({ status: "open", limit: 200 }),
    ]);
    return NextResponse.json({ items, unanswered });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load Guide conversations." }, { status: error?.status || 500 });
  }
}
