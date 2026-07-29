import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../../../lib/server/adminAuth";
import { prepareEnquiryWhatsapp } from "../../../../../../lib/server/enquiriesRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../../../lib/server/requestSecurity";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "enquiries.communicate");
    const body = await readJsonBody(request, 12_000);
    const { id } = await params;
    return NextResponse.json(await prepareEnquiryWhatsapp(id, body, admin));
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to prepare this WhatsApp message." }, { status: error?.status || 500 });
  }
}
