import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../../lib/server/adminAuth";
import { listCommunicationTemplateVersions, restoreCommunicationTemplateVersion } from "../../../../../lib/server/communicationTemplatesRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request, "communicationTemplates.read");
    const { id } = await params;
    return NextResponse.json({ items: await listCommunicationTemplateVersions(id) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load template history." }, { status: error?.status || 500 });
  }
}

export async function POST(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "communicationTemplates.manage");
    const body = await readJsonBody(request, 5_000);
    const { id } = await params;
    if (!body?.versionId) return NextResponse.json({ error: "Choose a version to restore." }, { status: 400 });
    return NextResponse.json({ item: await restoreCommunicationTemplateVersion(id, body.versionId, admin) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to restore the template version." }, { status: error?.status || 500 });
  }
}
