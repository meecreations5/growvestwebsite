const BREVO_BASE_URL = "https://api.brevo.com/v3";

export class BrevoError extends Error {
  constructor(message, status = 502, providerCode = "BREVO_REQUEST_FAILED") {
    super(message);
    this.name = "BrevoError";
    this.status = status;
    this.providerCode = providerCode;
  }
}

function getApiKey() {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new BrevoError("Brevo is not configured.", 503, "BREVO_NOT_CONFIGURED");
  return apiKey;
}

async function brevoRequest(path, options) {
  const response = await fetch(`${BREVO_BASE_URL}${path}`, {
    ...options,
    headers: {
      accept: "application/json",
      "api-key": getApiKey(),
      "content-type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  const raw = await response.text();
  let body = {};
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = { message: raw.slice(0, 250) };
    }
  }

  if (!response.ok) {
    const providerMessage = String(body?.message || `Brevo returned HTTP ${response.status}`).slice(0, 250);
    throw new BrevoError(providerMessage, response.status >= 500 ? 502 : response.status, body?.code || "BREVO_REQUEST_FAILED");
  }

  return body;
}

export function getBrevoSender() {
  const email = process.env.BREVO_DEFAULT_SENDER_EMAIL || process.env.BREVO_SENDER_EMAIL;
  if (!email) throw new BrevoError("Brevo sender email is not configured.", 503, "BREVO_SENDER_MISSING");

  return {
    name: process.env.BREVO_DEFAULT_SENDER_NAME || process.env.BREVO_SENDER_NAME || "GrowVest",
    email,
  };
}

export async function sendTransactionalEmail({ to, subject, htmlContent, replyTo }) {
  const payload = {
    sender: getBrevoSender(),
    to: Array.isArray(to) ? to : [to],
    subject,
    htmlContent,
  };

  const configuredReplyTo = process.env.BREVO_REPLY_TO_EMAIL;
  if (replyTo?.email) {
    payload.replyTo = replyTo;
  } else if (configuredReplyTo) {
    payload.replyTo = { email: configuredReplyTo, name: "GrowVest" };
  }

  return brevoRequest("/smtp/email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createOrUpdateBrevoContact({ email, listId, attributes = {} }) {
  if (!listId || !Number.isFinite(Number(listId))) {
    throw new BrevoError("Brevo newsletter list is not configured.", 503, "BREVO_LIST_MISSING");
  }

  return brevoRequest("/contacts", {
    method: "POST",
    body: JSON.stringify({
      email,
      listIds: [Number(listId)],
      updateEnabled: true,
      attributes,
    }),
  });
}
