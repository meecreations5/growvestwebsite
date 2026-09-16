import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { backfillEnquiryDirectory } from "../../../../lib/server/enquiriesRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    await requireAdminRequest(request, "enquiries.manage");
    const body = await readJsonBody(request, 5_000);
    return NextResponse.json(await backfillEnquiryDirectory({ limitPerSource: Number(body?.limitPerSource || 10000) }));
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to rebuild the enquiry directory." }, { status: error?.status || 500 });
  }
}
