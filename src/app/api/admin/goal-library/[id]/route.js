import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { archiveGoal, updateGoal } from "../../../../lib/server/websiteContentRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "website.manage");
    const body = await readJsonBody(request, 60_000);
    const { id } = await params;
    return NextResponse.json({ item: await updateGoal(id, body, admin) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update the goal." }, { status: error?.status || 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "website.manage");
    const { id } = await params;
    return NextResponse.json({ item: await archiveGoal(id, admin) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to archive the goal." }, { status: error?.status || 500 });
  }
}
