import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { updateAdminUser } from "../../../../lib/server/adminUsersRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const actor = await requireAdminRequest(request, "admins.manage");
    const { uid } = await params;
    const body = await readJsonBody(request, 6000);
    return NextResponse.json({ item: await updateAdminUser(uid, body, actor) });
  } catch (error) { return NextResponse.json({ error: error?.message || "Unable to update administrator." }, { status: error?.status || 500 }); }
}
