"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "../lib/analytics";
import { setFirebaseAnalyticsConsent } from "../lib/firebaseClient";

const CONSENT_KEY = "growvest_cookie_consent";

function readDataset(element) {
  const parameters = {};

  Object.entries(element.dataset).forEach(([key, value]) => {
    if (!key.startsWith("analytics") || key === "analyticsEvent" || !value) return;
    const parameterName = key
      .replace(/^analytics/, "")
      .replace(/^[A-Z]/, (letter) => letter.toLowerCase())
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    parameters[parameterName] = value;
  });

  return parameters;
}

export function SiteAnalytics() {
  const pathname = usePathname() || "/";
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const lastPageView = useRef("");

  useEffect(() => {
    function syncConsent(event) {
      if (event?.detail && typeof event.detail.analytics === "boolean") {
        setAnalyticsAllowed(event.detail.analytics);
        return;
      }
      setAnalyticsAllowed(window.localStorage.getItem(CONSENT_KEY) === "accepted");
    }

    syncConsent();
    window.addEventListener("growvest:consent", syncConsent);
    return () => window.removeEventListener("growvest:consent", syncConsent);
  }, []);

  useEffect(() => {
    let active = true;

    if (!analyticsAllowed) {
      lastPageView.current = "";
      setAnalyticsReady(false);
      void setFirebaseAnalyticsConsent(false);
      return () => {
        active = false;
      };
    }

    void setFirebaseAnalyticsConsent(true).then((ready) => {
      if (active) setAnalyticsReady(Boolean(ready));
    });

    return () => {
      active = false;
    };
  }, [analyticsAllowed]);

  useEffect(() => {
    if (!analyticsReady) return;

    const pageViewKey = `${pathname}|${document.title}`;
    if (lastPageView.current === pageViewKey) return;
    lastPageView.current = pageViewKey;

    trackEvent("page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [analyticsReady, pathname]);

  useEffect(() => {
    if (!analyticsReady) return undefined;

    const thresholds = [25, 50, 75, 90];
    const reached = new Set();
    let frame = null;

    function updateScrollDepth() {
      frame = null;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (documentHeight <= 0) return;

      const percentage = Math.round((window.scrollY / documentHeight) * 100);
      thresholds.forEach((threshold) => {
        if (percentage >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          trackEvent("scroll_depth", { percent_scrolled: threshold });
        }
      });
    }

    function requestScrollUpdate() {
      if (frame === null) frame = window.requestAnimationFrame(updateScrollDepth);
    }

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestScrollUpdate);
    };
  }, [analyticsReady, pathname]);

  useEffect(() => {
    if (!analyticsReady) return undefined;

    function handleTrackedClick(event) {
      if (!(event.target instanceof Element)) return;
      const explicitTarget = event.target.closest("[data-analytics-event]");
      const interactionTarget = explicitTarget || event.target.closest("a, button");
      if (!interactionTarget) return;

      const label = interactionTarget.textContent?.trim().replace(/\s+/g, " ").slice(0, 100) || "";
      const standardEvents = {
        "Begin Your Journey": "primary_cta_click",
        "Explore Your Goals": "secondary_cta_click",
        "Investor Portal": "investor_portal_click",
      };
      const eventName = explicitTarget?.dataset.analyticsEvent || standardEvents[label];
      if (!eventName) return;

      trackEvent(eventName, {
        link_text: label || undefined,
        link_url: interactionTarget.getAttribute("href") || undefined,
        ...readDataset(interactionTarget),
      });
    }

    document.addEventListener("click", handleTrackedClick, true);
    return () => document.removeEventListener("click", handleTrackedClick, true);
  }, [analyticsReady]);

  return null;
}
