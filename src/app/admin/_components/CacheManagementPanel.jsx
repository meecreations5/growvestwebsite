"use client";

import { useState } from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";

const PRESETS = [
  {
    key: "website",
    title: "Website content",
    description: "Refreshes homepage, About, navigation, footer, FAQs and Goal Library content.",
  },
  {
    key: "insights",
    title: "Insights and SEO feeds",
    description: "Refreshes the Insights library, article pages, RSS feed and sitemap entries.",
  },
  {
    key: "people",
    title: "Team and investor experiences",
    description: "Refreshes team profiles, social links and published testimonials.",
  },
  {
    key: "guide",
    title: "GrowVest Guide knowledge",
    description: "Refreshes approved Guide settings and its published knowledge sources.",
  },
  {
    key: "all",
    title: "Entire public website",
    description: "Purges every managed public-content cache. Use this only after broad production changes.",
    destructive: true,
  },
];

export function CacheManagementPanel() {
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function refresh(preset) {
    if (preset.destructive && !window.confirm("Refresh every public website cache now?")) return;
    setBusy(preset.key);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/cache/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ preset: preset.key }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "The cache could not be refreshed.");
      setMessage(`${preset.title} cache refreshed successfully.`);
    } catch (requestError) {
      setError(requestError.message || "The cache could not be refreshed.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PRESETS.map((preset) => (
          <section key={preset.key} className={`rounded-2xl border bg-white p-5 shadow-sm ${preset.destructive ? "border-amber-200" : "border-black/5"}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#1F4ED8]">
              <RefreshCw size={19} />
            </div>
            <h2 className="mt-5 font-serif text-xl font-bold text-[#0B0B0F]">{preset.title}</h2>
            <p className="mt-2 min-h-16 text-sm leading-6 text-[#6B7280]">{preset.description}</p>
            <button
              type="button"
              disabled={Boolean(busy)}
              onClick={() => refresh(preset)}
              className={`mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-xs font-bold transition disabled:opacity-50 ${preset.destructive ? "border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100" : "bg-[#1F4ED8] text-white hover:bg-[#173FB4]"}`}
            >
              <RefreshCw size={14} className={busy === preset.key ? "animate-spin" : ""} />
              {busy === preset.key ? "Refreshing…" : "Refresh cache"}
            </button>
          </section>
        ))}
      </div>

      {message ? (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 size={17} /> {message}
        </div>
      ) : null}
      {error ? <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}
    </div>
  );
}
