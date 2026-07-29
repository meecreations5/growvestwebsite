import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { getWebsiteSettings, updateWebsiteSettings } from "../../../../lib/server/websiteContentRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "website.read");
    return NextResponse.json({ item: await getWebsiteSettings() });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load website settings." }, { status: error?.status || 500 });
  }
}

export async function PATCH(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "website.manage");
    const body = await readJsonBody(request, 120_000);
    return NextResponse.json({ item: await updateWebsiteSettings(body, admin) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update website settings." }, { status: error?.status || 500 });
  }
}
