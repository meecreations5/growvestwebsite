import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { seedGuideKnowledge } from "../../../../lib/server/growvestGuideRepository";
import { assertAllowedOrigin } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "guide.manage");
    const result = await seedGuideKnowledge(admin);
    revalidateTag("growvest-guide-knowledge");
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to seed approved GrowVest Guide answers." }, { status: error?.status || 500 });
  }
}
