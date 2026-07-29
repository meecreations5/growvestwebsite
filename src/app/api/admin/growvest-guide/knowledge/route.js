import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { createGuideKnowledge, listGuideKnowledge } from "../../../../lib/server/growvestGuideRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "guide.read");
    return NextResponse.json({ items: await listGuideKnowledge() });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load Guide answers." }, { status: error?.status || 500 });
  }
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "guide.manage");
    const body = await readJsonBody(request, 32_000);
    const item = await createGuideKnowledge(body, admin);
    revalidateTag("growvest-guide-knowledge");
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to add the Guide answer." }, { status: error?.status || 500 });
  }
}
