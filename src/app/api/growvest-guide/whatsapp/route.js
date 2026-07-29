import { NextResponse } from "next/server";
import { getAdminDb, isFirebaseAdminConfigured } from "../../../lib/server/firebaseAdmin";
import { buildConversationSummary, sanitizeGuideClientContext } from "../../../lib/server/growvestGuideEngine";
import { getGuideSessionContext, getGuideSettings, recordGuideHandoff } from "../../../lib/server/growvestGuideRepository";
import { ApiError, assertAllowedOrigin, cleanText, enforceRateLimit, getRequestContext, readJsonBody } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function response(payload, status = 200) {
  return NextResponse.json(payload, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const body = await readJsonBody(request, 22_000);
    const settings = await getGuideSettings({ publicOnly: true });
    if (!settings.isEnabled || !settings.whatsappEnabled) throw new ApiError(503, "WhatsApp handoff is temporarily unavailable.", "GUIDE_WHATSAPP_DISABLED");

    if (body?.consentAccepted !== true) {
      throw new ApiError(400, "Please confirm that you want to share this conversation context with the GrowVest team.", "GUIDE_HANDOFF_CONSENT_REQUIRED");
    }

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

    const storedContext = settings.sessionMemoryEnabled !== false ? await getGuideSessionContext(sessionId) : {};
    const clientContext = sanitizeGuideClientContext(body?.conversationContext || {});
    const conversationContext = sanitizeGuideClientContext({ ...clientContext, ...storedContext });
    const conversationSummary = buildConversationSummary(conversationContext, question);

    const message = [
      "Hello GrowVest, I am continuing a conversation from GrowVest Guide.",
      name ? `Name: ${name}` : "",
      conversationContext.intentLabel ? `Goal / intent: ${conversationContext.intentLabel}` : "",
      conversationContext.timeline ? `Timeline: ${conversationContext.timeline}` : "",
      conversationContext.planningStatus ? `Current position: ${conversationContext.planningStatus}` : "",
      question ? `Latest question: ${question}` : "",
      conversationSummary ? `Conversation summary: ${conversationSummary}` : "",
      sessionId ? `Guide reference: ${sessionId}` : "",
    ].filter(Boolean).join("\n");
    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    const result = await recordGuideHandoff({
      sessionId,
      name,
      phone,
      question,
      pageUrl,
      whatsappUrl,
      targetNumber: number,
      conversationSummary,
      intentId: conversationContext.intentId,
      intentLabel: conversationContext.intentLabel,
      timeline: conversationContext.timeline,
      planningStatus: conversationContext.planningStatus,
      context: getRequestContext(request),
    });
    return response({ ok: true, whatsappUrl, leadKey: result.leadKey, label: settings.whatsappLabel, conversationSummary });
  } catch (error) {
    return response({ ok: false, code: error?.code || "GUIDE_WHATSAPP_FAILED", message: error?.message || "Unable to prepare the WhatsApp conversation." }, error?.status || 500);
  }
}
