import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../lib/server/adminAuth";
import { addAdminUser, listAdminUsers } from "../../../lib/server/adminUsersRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../lib/server/requestSecurity";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request) {
  try {
    await requireAdminRequest(request, "admins.manage");
    return NextResponse.json({ items: await listAdminUsers() });
  } catch (error) { return NextResponse.json({ error: error?.message || "Unable to list administrators." }, { status: error?.status || 500 }); }
}
export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const actor = await requireAdminRequest(request, "admins.manage");
    const body = await readJsonBody(request, 6000);
    return NextResponse.json({ item: await addAdminUser(body, actor) }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error?.message || "Unable to grant access." }, { status: error?.status || 500 }); }
}
