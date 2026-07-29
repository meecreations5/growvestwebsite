"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { hasAnalyticsConsent, trackEvent } from "../lib/analytics";

async function record(postId, eventType) {
  if (!hasAnalyticsConsent()) return;
  await fetch("/api/insights/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, eventType }),
    keepalive: true,
  }).catch(() => null);
}

export function InsightViewTracker({ postId, slug }) {
  useEffect(() => {
    const key = `growvest_insight_view_${postId}`;
    if (window.sessionStorage.getItem(key)) return;
    const timer = window.setTimeout(() => {
      if (!hasAnalyticsConsent()) return;
      window.sessionStorage.setItem(key, "1");
      trackEvent("insight_view", { insight_id: postId, insight_slug: slug });
      void record(postId, "view");
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [postId, slug]);
  return null;
}

export function InsightShare({ postId, title }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = window.location.href;
    let completed = false;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        completed = true;
      } catch {
        completed = false;
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      completed = true;
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
    if (completed) {
      trackEvent("insight_share", { insight_id: postId });
      void record(postId, "share");
    }
  }
  return <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-[#1F4ED8] hover:bg-blue-50">{copied ? <Check size={15} /> : (typeof navigator !== "undefined" && navigator.share) ? <Share2 size={15} /> : <Copy size={15} />} {copied ? "Link copied" : "Share Insight"}</button>;
}

export function InsightCta({ postId }) {
  return <Link href="/contact" onClick={() => { trackEvent("insight_cta_click", { insight_id: postId }); void record(postId, "cta_click"); }} className="mt-7 inline-flex rounded-full bg-[#1F4ED8] px-6 py-3 text-sm font-bold text-white">Begin Your Journey</Link>;
}
