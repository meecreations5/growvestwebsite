import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../../lib/server/adminAuth";
import { convertEnquiry } from "../../../../../lib/server/enquiriesRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../../lib/server/requestSecurity";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "enquiries.convert");
    const body = await readJsonBody(request, 12_000);
    const { id } = await params;
    return NextResponse.json(await convertEnquiry(id, body, admin));
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to convert this enquiry." }, { status: error?.status || 500 });
  }
}
