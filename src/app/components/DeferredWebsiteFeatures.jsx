"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DeferredGrowVestGuide = dynamic(
  () => import("./GrowVestGuide").then((module) => module.GrowVestGuide),
  { ssr: false, loading: () => null },
);
const DeferredSiteMotionEffects = dynamic(
  () => import("./SiteMotionEffects").then((module) => module.SiteMotionEffects),
  { ssr: false, loading: () => null },
);
const DeferredSiteAnalytics = dynamic(
  () => import("./SiteAnalytics").then((module) => module.SiteAnalytics),
  { ssr: false, loading: () => null },
);
const DeferredWebVitalsReporter = dynamic(
  () => import("./WebVitalsReporter").then((module) => module.WebVitalsReporter),
  { ssr: false, loading: () => null },
);

export function DeferredWebsiteFeatures({ guideSettings }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId = null;
    let timeoutId = null;

    const activate = () => setReady(true);
    const interactionEvents = ["pointerdown", "keydown", "touchstart"];
    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, activate, { once: true, passive: true });
    });

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(activate, { timeout: 1400 });
    } else {
      timeoutId = window.setTimeout(activate, 900);
    }

    return () => {
      interactionEvents.forEach((eventName) => window.removeEventListener(eventName, activate));
      if (idleId !== null && typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <DeferredSiteMotionEffects />
      {guideSettings?.isEnabled === false ? null : <DeferredGrowVestGuide settings={guideSettings} />}
      <DeferredSiteAnalytics />
      <DeferredWebVitalsReporter />
    </>
  );
}
