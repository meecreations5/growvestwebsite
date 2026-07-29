import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdminRequest } from "../../../lib/server/adminAuth";
import { createSocialLink, listSocialLinks } from "../../../lib/server/teamSocialRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "social.read");
    return NextResponse.json({ items: await listSocialLinks() });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load social accounts." }, { status: error?.status || 500 });
  }
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "social.manage");
    const body = await readJsonBody(request, 40_000);
    const item = await createSocialLink(body, admin);
    revalidateTag("growvest-social");
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to add the social account." }, { status: error?.status || 500 });
  }
}
