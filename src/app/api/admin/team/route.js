import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminRequest } from "../../../lib/server/adminAuth";
import { createTeamMember, listTeamMembers } from "../../../lib/server/teamSocialRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "team.read");
    return NextResponse.json({ items: await listTeamMembers() });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load the team." }, { status: error?.status || 500 });
  }
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "team.manage");
    const body = await readJsonBody(request, 80_000);
    const item = await createTeamMember(body, admin);
    revalidateTag("growvest-team");
    revalidatePath("/about");
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to create the team profile." }, { status: error?.status || 500 });
  }
}
