"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, LoaderCircle, Save } from "lucide-react";
import { PageFaqItemsEditor } from "./PageFaqItemsEditor";

const baseClass = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#1F4ED8]";
function TextField({ label, value, onChange, help, rows = 0, maxLength }) {
  return <label className="block text-sm font-semibold text-[#111827]">{label}
    {rows ? <textarea rows={rows} maxLength={maxLength} value={value || ""} onChange={(event) => onChange(event.target.value)} className={baseClass} /> : <input type="text" maxLength={maxLength} value={value || ""} onChange={(event) => onChange(event.target.value)} className={baseClass} />}
    {help ? <span className="mt-1 block text-xs font-normal leading-5 text-[#6B7280]">{help}</span> : null}
  </label>;
}

export function SitePageSettingsEditor({ page, initialItem }) {
  const [form, setForm] = useState(initialItem);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const seo = form?.seo || {};
  const seoSection = form?.content?.seoSection || {};
  const faqSection = form?.content?.faqSection || {};
  const pageFaqs = Array.isArray(form?.content?.pageFaqs) ? form.content.pageFaqs : [];
  const setRoot = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const setSeo = (key, value) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }));
  const setContent = (section, key, value) => setForm((prev) => ({ ...prev, content: { ...prev.content, [section]: { ...prev.content?.[section], [key]: value } } }));
  const setPageFaqs = (items) => setForm((prev) => ({ ...prev, content: { ...prev.content, pageFaqs: items } }));

  async function save(event) {
    event.preventDefault();
    setBusy(true); setMessage(""); setError("");
    try {
      const response = await fetch(`/api/admin/website/pages/${encodeURIComponent(page.key)}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to save page settings.");
      setForm(data.item);
      setMessage("Page settings saved. Published changes are now queued for cache revalidation.");
    } catch (reason) { setError(reason?.message || "Unable to save this page."); }
    finally { setBusy(false); }
  }

  return <form onSubmit={save} className="mx-auto max-w-[1050px] space-y-6 pb-12">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-widest text-[#1F4ED8]">Website Content / Page Settings</p><h1 className="mt-2 font-serif text-3xl font-bold">{page.label}</h1><p className="mt-2 text-sm text-[#64748B]">{page.path} · Metadata, optional supporting content and page-specific FAQs.</p></div>
      <Link href={page.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold">View live page <ExternalLink size={15} /></Link>
    </div>
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="font-serif text-2xl font-bold">Search & social metadata</h2>
      <p className="mt-2 text-sm leading-6 text-[#64748B]">Managed metadata renders server-side. Keep each title and description unique and accurately aligned with the visible page.</p>
      <div className="mt-6 grid gap-5">
        <TextField label="Page name (admin only)" value={form?.title} maxLength={180} onChange={(v) => setRoot("title", v)} />
        <TextField label={`SEO title (${String(seo.title || "").length} characters)`} value={seo.title} maxLength={180} onChange={(v) => setSeo("title", v)} help="Aim for a concise, unique search title. Google may truncate or rewrite it." />
        <TextField label={`Meta description (${String(seo.description || "").length} characters)`} rows={4} value={seo.description} maxLength={320} onChange={(v) => setSeo("description", v)} help="Write a descriptive summary of the actual page; search engines may rewrite snippets." />
        <div className="grid gap-5 md:grid-cols-2">
          <TextField label="Canonical URL" value={seo.canonicalUrl} onChange={(v) => setSeo("canonicalUrl", v)} help="Leave blank for the main GrowVest URL for this page." />
          <TextField label="Social share image URL" value={seo.openGraphImage} onChange={(v) => setSeo("openGraphImage", v)} help="Absolute HTTPS URL or internal path. Prefer 1200 × 630." />
        </div>
        <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={page.key !== "thank-you" && seo.allowIndexing !== false} disabled={page.key === "thank-you"} onChange={(e) => setSeo("allowIndexing", e.target.checked)} className="h-4 w-4 accent-[#1F4ED8]" /> Allow this page to be indexed{page.key === "thank-you" ? " (confirmation page always noindex)" : ""}</label>
        <div className="rounded-xl border border-gray-200 bg-[#F8FAFC] p-5"><p className="text-xs text-emerald-700">growvest.info{page.path === "/" ? "" : page.path}</p><p className="mt-2 text-lg font-semibold text-[#1F4ED8]">{seo.title || page.title}</p><p className="mt-2 text-sm leading-6 text-[#6B7280]">{seo.description || "Add an informative page description."}</p></div>
      </div>
    </section>
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="font-serif text-2xl font-bold">Optional on-page supporting content</h2>
      <p className="mt-2 text-sm leading-6 text-[#64748B]">Adds a fully server-rendered heading and text section below the existing designed page content. It does not replace the page's original layout or copy.</p>
      <div className="mt-5 space-y-5">
        <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={seoSection.enabled === true} onChange={(e) => setContent("seoSection", "enabled", e.target.checked)} className="h-4 w-4 accent-[#1F4ED8]" /> Show supporting content section</label>
        <TextField label="Section heading (H2)" value={seoSection.heading} maxLength={160} onChange={(v) => setContent("seoSection", "heading", v)} />
        <TextField label="Section content" rows={7} value={seoSection.body} onChange={(v) => setContent("seoSection", "body", v)} help="Use blank lines to separate paragraphs. Write for visitors, not keyword stuffing." />
      </div>
    </section>
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="font-serif text-2xl font-bold">FAQs for this page</h2>
      <p className="mt-2 text-sm leading-6 text-[#64748B]">Manage questions unique to this page below, or assign reusable questions through <Link href="/admin/faqs" className="font-semibold text-[#1F4ED8] underline">shared FAQ Management</Link>. Published page questions appear first, followed by published shared questions assigned to this route. Identical questions are not repeated.</p>
      <div className="mt-5 space-y-5">
        {page.key === "faqs" ? (
          <p className="rounded-xl bg-[#F8FAFC] p-4 text-sm leading-6 text-[#64748B]">This URL already displays the complete FAQ directory. Edit directory questions through <Link href="/admin/faqs" className="font-semibold text-[#1F4ED8] underline">FAQ Management</Link>; no second FAQ accordion is added here.</p>
        ) : <>
          <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={faqSection.enabled !== false} onChange={(e) => setContent("faqSection", "enabled", e.target.checked)} className="h-4 w-4 accent-[#1F4ED8]" /> Display this page's FAQs</label>
          <TextField label="FAQ section heading" value={faqSection.heading ?? "Questions you may have"} maxLength={160} onChange={(v) => setContent("faqSection", "heading", v)} />
          <TextField label="Optional introduction" rows={3} value={faqSection.introduction} onChange={(v) => setContent("faqSection", "introduction", v)} />
          <PageFaqItemsEditor items={pageFaqs} onChange={setPageFaqs} />
        </>}
      </div>
    </section>
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="font-serif text-2xl font-bold">Publication</h2>
      <p className="mt-2 text-sm leading-6 text-[#64748B]">Published updates become public after cache revalidation. Draft or archived records use the site's built-in approved fallback, rather than taking the route offline.</p>
      <label className="mt-5 block text-sm font-semibold">Page record status<select value={form?.status || "published"} onChange={(e) => setRoot("status", e.target.value)} className={baseClass}><option value="draft">Draft (fallback stays live)</option><option value="published">Published</option><option value="archived">Archived (fallback stays live)</option></select></label>
    </section>
    {message ? <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
    {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
    <div className="sticky bottom-4 flex justify-end"><button type="submit" disabled={busy} className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#1F4ED8] px-6 text-sm font-semibold text-white shadow-xl disabled:opacity-60">{busy ? <LoaderCircle size={17} className="animate-spin" /> : <Save size={17} />} Save page settings</button></div>
  </form>;
}
