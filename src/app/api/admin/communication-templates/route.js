import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../lib/server/adminAuth";
import { createCommunicationTemplate, listCommunicationTemplates } from "../../../lib/server/communicationTemplatesRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "communicationTemplates.read");
    const { searchParams } = new URL(request.url);
    return NextResponse.json({ items: await listCommunicationTemplates({ channel: searchParams.get("channel") || "all", status: searchParams.get("status") || "all", search: searchParams.get("search") || "" }) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load communication templates." }, { status: error?.status || 500 });
  }
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "communicationTemplates.manage");
    const body = await readJsonBody(request, 35_000);
    return NextResponse.json({ item: await createCommunicationTemplate(body, admin) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to create the communication template." }, { status: error?.status || 500 });
  }
}
