import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../lib/server/adminAuth";
import { createGoal, listGoalLibrary } from "../../../lib/server/websiteContentRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "website.read");
    return NextResponse.json({ items: await listGoalLibrary() });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load the goal library." }, { status: error?.status || 500 });
  }
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "website.manage");
    const body = await readJsonBody(request, 60_000);
    return NextResponse.json({ item: await createGoal(body, admin) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to create the goal." }, { status: error?.status || 500 });
  }
}
