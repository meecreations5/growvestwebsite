import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { getEnquiryDetails, updateEnquiry } from "../../../../lib/server/enquiriesRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request, "enquiries.read");
    const { id } = await params;
    const result = await getEnquiryDetails(id);
    if (!result) return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load this enquiry." }, { status: error?.status || 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "enquiries.manage");
    const body = await readJsonBody(request, 35_000);
    const { id } = await params;
    return NextResponse.json({ item: await updateEnquiry(id, body, admin) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update this enquiry." }, { status: error?.status || 500 });
  }
}
