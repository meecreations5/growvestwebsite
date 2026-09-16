import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { archiveTeamMember, getTeamMember, updateTeamMember } from "../../../../lib/server/teamSocialRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request, "team.read");
    const { id } = await params;
    const item = await getTeamMember(id);
    if (!item) return NextResponse.json({ error: "Team member not found." }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load the team profile." }, { status: error?.status || 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "team.manage");
    const { id } = await params;
    const body = await readJsonBody(request, 80_000);
    const item = await updateTeamMember(id, body, admin);
    revalidateTag("growvest-team");
    revalidatePath("/about");
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update the team profile." }, { status: error?.status || 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "team.manage");
    const { id } = await params;
    await archiveTeamMember(id, admin);
    revalidateTag("growvest-team");
    revalidatePath("/about");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to archive the team profile." }, { status: error?.status || 500 });
  }
}
