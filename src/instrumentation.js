function safeMessage(error) {
  if (error instanceof Error) return error.message.slice(0, 1000);
  return String(error || "Unknown server error").slice(0, 1000);
}

function safeWebhookUrl() {
  const value = String(process.env.GROWVEST_OBSERVABILITY_WEBHOOK_URL || "").trim();
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  console.info(JSON.stringify({
    level: "info",
    event: "growvest_server_started",
    service: "growvest-public-website",
    release: process.env.NEXT_PUBLIC_APP_VERSION || "23.0.0",
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  }));
}

export async function onRequestError(error, request, context) {
  const payload = {
    level: "error",
    event: "growvest_request_error",
    service: "growvest-public-website",
    release: process.env.NEXT_PUBLIC_APP_VERSION || "23.0.0",
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    message: safeMessage(error),
    digest: typeof error === "object" && error && "digest" in error ? String(error.digest || "") : "",
    path: String(request?.path || "").slice(0, 500),
    method: String(request?.method || "").slice(0, 20),
    requestId: String(request?.headers?.["x-request-id"] || request?.headers?.get?.("x-request-id") || "").slice(0, 120),
    routePath: String(context?.routePath || "").slice(0, 500),
    routeType: String(context?.routeType || "").slice(0, 100),
    renderSource: String(context?.renderSource || "").slice(0, 100),
    timestamp: new Date().toISOString(),
  };

  console.error(JSON.stringify(payload));

  const webhookUrl = safeWebhookUrl();
  if (!webhookUrl) return;

  try {
    const headers = { "Content-Type": "application/json" };
    const token = String(process.env.GROWVEST_OBSERVABILITY_TOKEN || "").trim();
    if (token) headers.Authorization = `Bearer ${token}`;

    await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    });
  } catch (webhookError) {
    console.warn(JSON.stringify({
      level: "warn",
      event: "growvest_observability_delivery_failed",
      message: safeMessage(webhookError),
      timestamp: new Date().toISOString(),
    }));
  }
}
