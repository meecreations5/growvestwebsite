import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { archiveMedia } from "../../../../lib/server/mediaRepository";
import { assertAllowedOrigin } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";

export async function DELETE(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "media.manage");
    const { id } = await params;
    await archiveMedia(id, admin);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to archive media." }, { status: error?.status || 500 });
  }
}
