import { logFirebaseAnalyticsEvent } from "./firebaseClient";

const CONSENT_KEY = "growvest_cookie_consent";

function normalizeName(value, fallback) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);

  if (!normalized) return fallback;
  return /^[a-z]/.test(normalized) ? normalized : `gv_${normalized}`.slice(0, 40);
}

function sanitizeParameters(parameters) {
  return Object.entries(parameters).reduce((result, [key, value]) => {
    if (value === undefined || value === null || value === "") return result;

    const parameterName = normalizeName(key, "value");

    if (typeof value === "boolean") {
      result[parameterName] = value ? 1 : 0;
    } else if (typeof value === "number" && Number.isFinite(value)) {
      result[parameterName] = value;
    } else if (value instanceof Date) {
      result[parameterName] = value.toISOString();
    } else {
      result[parameterName] = String(value).slice(0, 100);
    }

    return result;
  }, {});
}

export function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONSENT_KEY) === "accepted";
}

export function trackEvent(eventName, parameters = {}) {
  if (typeof window === "undefined" || !eventName || !hasAnalyticsConsent()) return;

  const normalizedEventName = normalizeName(eventName, "growvest_event");
  const eventParameters = sanitizeParameters({
    page_path: window.location.pathname,
    page_title: document.title,
    ...parameters,
  });

  const payload = {
    event: normalizedEventName,
    ...eventParameters,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("growvest:analytics", { detail: payload }));

  void logFirebaseAnalyticsEvent(normalizedEventName, eventParameters).catch((error) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("GrowVest analytics event could not be recorded:", error);
    }
  });
}
