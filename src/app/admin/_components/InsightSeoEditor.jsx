"use client";

import Link from "next/link";
import { useState } from "react";
import { LoaderCircle, Save } from "lucide-react";

export function InsightSeoEditor({ post }) {
  const [seo, setSeo] = useState({
    title: post.seo?.title || "", description: post.seo?.description || "",
    canonicalUrl: post.seo?.canonicalUrl || "", openGraphImage: post.seo?.openGraphImage || "",
    allowIndexing: post.seo?.allowIndexing !== false,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const update = (field, value) => setSeo((prev) => ({ ...prev, [field]: value }));
  const inputClass = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1F4ED8]";

  async function save(event) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/admin/insights/${encodeURIComponent(post.id)}/seo`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(seo),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save SEO data.");
      setSeo(result.post.seo);
      setMessage("SEO settings saved. The article's content and publication status were not changed.");
    } catch (reason) { setError(reason?.message || "Unable to save SEO data."); }
    finally { setBusy(false); }
  }

  return <form onSubmit={save} className="mx-auto max-w-[930px] space-y-6 pb-12">
    <div><p className="text-xs font-bold uppercase tracking-widest text-[#1F4ED8]">SEO Centre / Insight Metadata</p><h1 className="mt-2 font-serif text-3xl font-bold">{post.title}</h1><p className="mt-2 text-sm text-[#64748B]">Edit search appearance for this article without changing its published text, author, approval or status.</p></div>
    <section className="space-y-5 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <label className="block text-sm font-semibold">SEO title ({seo.title.length}/70)<input maxLength={70} value={seo.title} onChange={(e) => update("title", e.target.value)} className={inputClass} placeholder={post.title} /></label>
      <label className="block text-sm font-semibold">Meta description ({seo.description.length}/170)<textarea maxLength={170} rows={4} value={seo.description} onChange={(e) => update("description", e.target.value)} className={inputClass} placeholder={post.excerpt} /></label>
      <label className="block text-sm font-semibold">Canonical URL<input value={seo.canonicalUrl} onChange={(e) => update("canonicalUrl", e.target.value)} className={inputClass} placeholder={`https://growvest.info/insights/${post.slug}`} /><span className="mt-1 block text-xs font-normal text-[#64748B]">Leave blank to use the article's own URL.</span></label>
      <label className="block text-sm font-semibold">Social share image URL<input value={seo.openGraphImage} onChange={(e) => update("openGraphImage", e.target.value)} className={inputClass} placeholder="https://..." /></label>
      <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={seo.allowIndexing} onChange={(e) => update("allowIndexing", e.target.checked)} className="h-4 w-4 accent-[#1F4ED8]" />Allow search indexing of this article</label>
      <div className="rounded-xl bg-[#F8FAFC] p-5"><p className="text-xs text-emerald-700">growvest.info/insights/{post.slug}</p><p className="mt-2 text-lg font-semibold text-[#1F4ED8]">{seo.title || post.title}</p><p className="mt-2 text-sm text-[#64748B]">{seo.description || post.excerpt}</p></div>
    </section>
    {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
    {message ? <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
    <div className="flex flex-wrap items-center justify-between gap-3"><Link href="/admin/seo" className="text-sm font-semibold text-[#1F4ED8]">Back to SEO Centre</Link><button type="submit" disabled={busy} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1F4ED8] px-5 text-sm font-semibold text-white disabled:opacity-60">{busy ? <LoaderCircle size={17} className="animate-spin" /> : <Save size={17} />}Save article SEO</button></div>
  </form>;
}
