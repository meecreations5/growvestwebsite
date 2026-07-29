import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { getGuideSettings, updateGuideSettings } from "../../../../lib/server/growvestGuideRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "guide.read");
    return NextResponse.json({ item: await getGuideSettings() });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load GrowVest Guide settings." }, { status: error?.status || 500 });
  }
}

export async function PATCH(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "guide.manage");
    const body = await readJsonBody(request, 40_000);
    const item = await updateGuideSettings(body, admin);
    revalidateTag("growvest-guide-settings");
    revalidatePath("/", "layout");
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to save GrowVest Guide settings." }, { status: error?.status || 500 });
  }
}
