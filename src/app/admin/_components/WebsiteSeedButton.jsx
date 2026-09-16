"use client";

import { useState } from "react";
import { Database, Eye, LoaderCircle, RefreshCcw } from "lucide-react";

function totalAction(group, key) {
  return Object.values(group || {}).reduce((total, item) => total + (Number(item?.[key]) || 0), 0);
}

function PreviewGroup({ title, data }) {
  const rows = Object.entries(data || {}).filter(([, value]) => value && typeof value === "object" && "create" in value);
  return (
    <div className="rounded-xl border border-black/5 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280]">{title}</p>
      <div className="mt-3 space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3 text-sm">
            <span className="capitalize text-[#374151]">{label}</span>
            <span className="text-xs font-semibold text-[#6B7280]">
              <span className="text-emerald-700">{value.create || 0} add</span> · {value.replace || 0} replace · {value.skip || 0} skip
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WebsiteSeedButton({ hasContent = false }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  async function previewImport(force = false) {
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/admin/website/seed?force=${force ? "true" : "false"}`, { cache: "no-store" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to preview the import.");
      setPreview({ ...result.preview, force });
    } catch (importError) {
      setError(importError?.message || "Unable to preview the import.");
    } finally {
      setBusy(false);
    }
  }

  async function importContent(force = false) {
    if (force && !window.confirm("Replace managed website content and matching Insights with the approved GrowVest defaults? Existing records will be versioned where supported before replacement.")) return;
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/website/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to import approved GrowVest content.");
      const website = result.result?.website || {};
      const insights = result.result?.insights || {};
      setMessage(`Content pushed to Firestore: ${website.pages || 0} pages, ${website.faqs || 0} FAQs, ${website.goals || 0} goals, ${insights.posts || 0} Insights, ${insights.categories || 0} categories, ${insights.tags || 0} tags and ${insights.authors || 0} authors.`);
      setPreview(null);
      window.setTimeout(() => window.location.reload(), 1100);
    } catch (importError) {
      setError(importError?.message || "Unable to import approved GrowVest content.");
    } finally {
      setBusy(false);
    }
  }

  const previewAdds = totalAction(preview?.website, "create") + totalAction(preview?.insights, "create");
  const previewReplaces = totalAction(preview?.website, "replace") + totalAction(preview?.insights, "replace");
  const previewSkips = totalAction(preview?.website, "skip") + totalAction(preview?.insights, "skip");

  return (
    <div className="rounded-2xl border border-[#1F4ED8]/15 bg-[#1F4ED8]/[0.04] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#1F4ED8]"><Database size={18} /><p className="text-sm font-bold">Approved content database import</p></div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B7280]">Push the approved static website content and the existing GrowVest Insights and Blog content into the shared Firestore database. Missing records are added without overwriting Admin-edited content.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[430px]">
          <button type="button" disabled={busy} onClick={() => previewImport(false)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#1F4ED8]/20 bg-white px-4 text-sm font-bold text-[#1F4ED8] disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" /> : <Eye size={16} />} Preview import</button>
          <button type="button" disabled={busy} onClick={() => importContent(false)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] px-4 text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" /> : <Database size={16} />} {hasContent ? "Push missing content" : "Push all approved content"}</button>
          {hasContent ? <button type="button" disabled={busy} onClick={() => previewImport(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold text-[#6B7280] hover:border-amber-200 hover:text-amber-700 disabled:opacity-60"><Eye size={14} /> Preview replacement</button> : null}
          {hasContent ? <button type="button" disabled={busy} onClick={() => importContent(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold text-[#6B7280] hover:border-red-200 hover:text-red-600 disabled:opacity-60"><RefreshCcw size={14} /> Replace approved defaults</button> : null}
        </div>
      </div>

      {preview ? (
        <div className="mt-5 rounded-2xl border border-black/5 bg-[#F4F6F9] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-[#0B0B0F]">{preview.force ? "Replacement preview" : "Missing-content preview"}</p>
              <p className="mt-1 text-xs text-[#6B7280]">{previewAdds} add · {previewReplaces} replace · {previewSkips} skip</p>
            </div>
            <button type="button" onClick={() => importContent(Boolean(preview.force))} disabled={busy} className="rounded-lg bg-[#0B0B0F] px-4 py-2 text-xs font-bold text-white disabled:opacity-60">Confirm and push</button>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <PreviewGroup title="Website content" data={preview.website} />
            <PreviewGroup title="Insights and Blog" data={preview.insights} />
          </div>
        </div>
      ) : null}

      {message ? <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
