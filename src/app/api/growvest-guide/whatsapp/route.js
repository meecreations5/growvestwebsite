import { NextResponse } from "next/server";
import { getAdminDb, isFirebaseAdminConfigured } from "../../../lib/server/firebaseAdmin";
import { getGuideSettings, recordGuideHandoff } from "../../../lib/server/growvestGuideRepository";
import { ApiError, assertAllowedOrigin, cleanText, enforceRateLimit, getRequestContext, readJsonBody } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function response(payload, status = 200) {
  return NextResponse.json(payload, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const body = await readJsonBody(request, 18_000);
    const settings = await getGuideSettings({ publicOnly: true });
    if (!settings.isEnabled || !settings.whatsappEnabled) throw new ApiError(503, "WhatsApp handoff is temporarily unavailable.", "GUIDE_WHATSAPP_DISABLED");

    if (isFirebaseAdminConfigured()) {
      await enforceRateLimit({ db: getAdminDb(), request, scope: "growvest_guide_whatsapp", limit: 6, windowMs: 60 * 60 * 1000 });
    }

    const sessionId = cleanText(body?.sessionId, 160);
    const question = cleanText(body?.question, 800);
    const name = cleanText(body?.name, 160);
    const phone = cleanText(body?.phone, 80);
    const pageUrl = cleanText(body?.pageUrl, 600);
    const number = cleanText(settings.whatsappNumber, 40).replace(/[^0-9]/g, "");
    if (!number) throw new ApiError(503, "GrowVest WhatsApp number is not configured.", "GUIDE_WHATSAPP_NUMBER_MISSING");

    const message = [
      "Hello GrowVest, I am continuing a conversation from GrowVest Guide.",
      name ? `Name: ${name}` : "",
      question ? `Question: ${question}` : "I would like to speak with the GrowVest team.",
      sessionId ? `Guide reference: ${sessionId}` : "",
    ].filter(Boolean).join("\n");
    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    const result = await recordGuideHandoff({ sessionId, name, phone, question, pageUrl, whatsappUrl, targetNumber: number, context: getRequestContext(request) });
    return response({ ok: true, whatsappUrl, leadKey: result.leadKey, label: settings.whatsappLabel });
  } catch (error) {
    return response({ ok: false, code: error?.code || "GUIDE_WHATSAPP_FAILED", message: error?.message || "Unable to prepare the WhatsApp conversation." }, error?.status || 500);
  }
}
