import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../../lib/server/adminAuth";
import { archiveGuideKnowledge, getGuideKnowledge, updateGuideKnowledge } from "../../../../../lib/server/growvestGuideRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request, "guide.read");
    const { id } = await params;
    const item = await getGuideKnowledge(id);
    if (!item) return NextResponse.json({ error: "Guide answer not found." }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load the Guide answer." }, { status: error?.status || 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "guide.manage");
    const { id } = await params;
    const body = await readJsonBody(request, 32_000);
    const item = await updateGuideKnowledge(id, body, admin);
    revalidateTag("growvest-guide-knowledge");
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update the Guide answer." }, { status: error?.status || 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "guide.manage");
    const { id } = await params;
    await archiveGuideKnowledge(id, admin);
    revalidateTag("growvest-guide-knowledge");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to archive the Guide answer." }, { status: error?.status || 500 });
  }
}
