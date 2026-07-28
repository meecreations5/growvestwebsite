import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../../lib/server/adminAuth";
import { resolveUnansweredQuestion } from "../../../../../lib/server/growvestGuideRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "guide.conversations");
    const { id } = await params;
    const body = await readJsonBody(request, 12_000);
    const item = await resolveUnansweredQuestion(id, body, admin);
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to resolve this question." }, { status: error?.status || 500 });
  }
}
