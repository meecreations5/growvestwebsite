import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../../lib/server/adminAuth";
import { addEnquiryNote } from "../../../../../lib/server/enquiriesRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../../lib/server/requestSecurity";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "enquiries.manage");
    const body = await readJsonBody(request, 15_000);
    const { id } = await params;
    return NextResponse.json({ note: await addEnquiryNote(id, body, admin) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to add this note." }, { status: error?.status || 500 });
  }
}
