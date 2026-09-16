import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { getEnquiryAnalytics } from "../../../../lib/server/enquiriesRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "enquiries.analytics");
    const { searchParams } = new URL(request.url);
    return NextResponse.json(await getEnquiryAnalytics({ from: searchParams.get("from") || "", to: searchParams.get("to") || "" }));
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load enquiry analytics." }, { status: error?.status || 500 });
  }
}
