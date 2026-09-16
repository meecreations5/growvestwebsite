import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../../lib/server/adminAuth";
import { listInsightVersions } from "../../../../../lib/server/insightsRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request, "insights.versions");
    const { id } = await params;
    const versions = await listInsightVersions(id, 50);
    return NextResponse.json({ versions });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load version history." }, { status: error?.status || 500 });
  }
}
