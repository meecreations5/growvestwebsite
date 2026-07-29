import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { getSocialLink, hideSocialLink, updateSocialLink } from "../../../../lib/server/teamSocialRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request, "social.read");
    const { id } = await params;
    const item = await getSocialLink(id);
    if (!item) return NextResponse.json({ error: "Social account not found." }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load the social account." }, { status: error?.status || 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "social.manage");
    const { id } = await params;
    const body = await readJsonBody(request, 40_000);
    const item = await updateSocialLink(id, body, admin);
    revalidateTag("growvest-social");
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update the social account." }, { status: error?.status || 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "social.manage");
    const { id } = await params;
    await hideSocialLink(id, admin);
    revalidateTag("growvest-social");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to hide the social account." }, { status: error?.status || 500 });
  }
}
