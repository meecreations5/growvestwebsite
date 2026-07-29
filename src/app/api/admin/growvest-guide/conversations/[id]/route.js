import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../../lib/server/adminAuth";
import { listGuideMessages, updateGuideConversation } from "../../../../../lib/server/growvestGuideRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request, "guide.conversations");
    const { id } = await params;
    return NextResponse.json({ messages: await listGuideMessages(id, { limit: 200 }) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load this Guide conversation." }, { status: error?.status || 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "guide.conversations");
    const { id } = await params;
    const body = await readJsonBody(request, 16_000);
    const item = await updateGuideConversation(id, body, admin);
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update this Guide conversation." }, { status: error?.status || 500 });
  }
}
