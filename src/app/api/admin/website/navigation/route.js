import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { getWebsiteNavigation, updateWebsiteNavigation } from "../../../../lib/server/websiteContentRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "website.read");
    return NextResponse.json({ item: await getWebsiteNavigation() });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load website navigation." }, { status: error?.status || 500 });
  }
}

export async function PATCH(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "website.manage");
    const body = await readJsonBody(request, 220_000);
    return NextResponse.json({ item: await updateWebsiteNavigation(body, admin) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update website navigation." }, { status: error?.status || 500 });
  }
}
