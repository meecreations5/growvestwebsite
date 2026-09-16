import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { archiveCommunicationTemplate, getCommunicationTemplate, updateCommunicationTemplate } from "../../../../lib/server/communicationTemplatesRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request, "communicationTemplates.read");
    const { id } = await params;
    const item = await getCommunicationTemplate(id);
    if (!item) return NextResponse.json({ error: "Template not found." }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load the communication template." }, { status: error?.status || 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "communicationTemplates.manage");
    const body = await readJsonBody(request, 35_000);
    const { id } = await params;
    return NextResponse.json({ item: await updateCommunicationTemplate(id, body, admin) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update the communication template." }, { status: error?.status || 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "communicationTemplates.manage");
    const { id } = await params;
    return NextResponse.json({ item: await archiveCommunicationTemplate(id, admin) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to archive the communication template." }, { status: error?.status || 500 });
  }
}
