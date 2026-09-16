import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../lib/server/adminAuth";
import { createManualEnquiry, listEnquiries } from "../../../lib/server/enquiriesRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "enquiries.read");
    const { searchParams } = new URL(request.url);
    return NextResponse.json(await listEnquiries({
      source: searchParams.get("source") || "all",
      status: searchParams.get("status") || "all",
      priority: searchParams.get("priority") || "all",
      assignee: searchParams.get("assignee") || "all",
      search: searchParams.get("search") || "",
      followUp: searchParams.get("followUp") || "all",
      page: Number(searchParams.get("page") || 1),
      pageSize: Number(searchParams.get("pageSize") || 25),
      cursor: searchParams.get("cursor") || "",
    }));
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load enquiries." }, { status: error?.status || 500 });
  }
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "enquiries.manage");
    const body = await readJsonBody(request, 35_000);
    return NextResponse.json({ item: await createManualEnquiry(body, admin) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to create this enquiry." }, { status: error?.status || 500 });
  }
}
