import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../../lib/server/adminAuth";
import { getWebsitePage, updateWebsitePage } from "../../../../../lib/server/websiteContentRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request, "website.read");
    const { key } = await params;
    const item = await getWebsitePage(key);
    if (!item) return NextResponse.json({ error: "This website page could not be found." }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load website content." }, { status: error?.status || 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "website.manage");
    const { key } = await params;
    const body = await readJsonBody(request, 500_000);
    return NextResponse.json({ item: await updateWebsitePage(key, body, admin) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update website content." }, { status: error?.status || 500 });
  }
}
