import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { listConversionRequests } from "../../../../lib/server/enquiriesRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "enquiries.convert");
    const { searchParams } = new URL(request.url);
    return NextResponse.json(await listConversionRequests({ status: searchParams.get("status") || "all", search: searchParams.get("search") || "", pageSize: Number(searchParams.get("pageSize") || 50) }));
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load conversion requests." }, { status: error?.status || 500 });
  }
}
