import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { exportEnquiriesCsv } from "../../../../lib/server/enquiriesRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "enquiries.analytics");
    const { searchParams } = new URL(request.url);
    const csv = await exportEnquiriesCsv({ source: searchParams.get("source") || "all", status: searchParams.get("status") || "all", priority: searchParams.get("priority") || "all", assignee: searchParams.get("assignee") || "all", search: searchParams.get("search") || "", followUp: searchParams.get("followUp") || "all", from: searchParams.get("from") || "", to: searchParams.get("to") || "" });
    return new NextResponse(csv, { status: 200, headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="growvest-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to export enquiries." }, { status: error?.status || 500 });
  }
}
