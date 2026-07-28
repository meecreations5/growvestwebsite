"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowUp, CalendarClock, Eye, History, Image as ImageIcon,
  LoaderCircle, Plus, Save, Send, Trash2,
} from "lucide-react";
import { MediaUploadField } from "./MediaUploadField";

const BLOCK_TYPES = [
  ["lead", "Lead paragraph"], ["heading2", "Heading 2"], ["heading3", "Heading 3"],
  ["paragraph", "Paragraph"], ["quote", "Quote"], ["callout", "Callout"],
  ["list", "Bullet list"], ["image", "Image"], ["table", "Table"],
  ["cta", "Call to action"], ["video", "Video embed"], ["divider", "Divider"],
  ["disclaimer", "Disclosure"],
];
const STATUS_OPTIONS = [
  ["draft", "Draft"], ["in_review", "Submit for review"], ["changes_requested", "Changes requested"],
  ["approved", "Approved"], ["scheduled", "Scheduled"], ["published", "Published"], ["archived", "Archived"],
];

function baseBlock(type, id) {
  return {
    id,
    type,
    title: "",
    text: "",
    items: [],
    url: "",
    altText: "",
    caption: "",
    buttonLabel: "Begin Your Journey",
    buttonHref: "/contact",
    variant: "primary",
    headers: [],
    rows: [],
    focalX: 50,
    focalY: 50,
  };
}

function createBlock(type = "paragraph") {
  const id = typeof crypto !== "undefined" && crypto.randomUUID ? `block-${crypto.randomUUID()}` : `block-${Date.now()}`;
  return baseBlock(type, id);
}

function normalizeBlock(block, index) {
  return { ...baseBlock(block?.type || "paragraph", block?.id || `block-${index + 1}`), ...block };
}

function normalizeInitial(post) {
  return {
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    status: post?.status || "draft",
    isFeatured: Boolean(post?.isFeatured),
    categoryIds: post?.categoryIds || [],
    tagIds: post?.tagIds || [],
    authorId: post?.authorId || "",
    authorName: post?.authorName || "",
    featuredImage: {
      url: post?.featuredImage?.url || "",
      altText: post?.featuredImage?.altText || "",
      caption: post?.featuredImage?.caption || "",
      focalX: Number(post?.featuredImage?.focalX ?? 50),
      focalY: Number(post?.featuredImage?.focalY ?? 50),
    },
    scheduledAt: post?.scheduledAt ? post.scheduledAt.slice(0, 16) : "",
    publishedAt: post?.publishedAt ? post.publishedAt.slice(0, 16) : "",
    reviewDueAt: post?.reviewDueAt ? post.reviewDueAt.slice(0, 10) : "",
    reviewerNotes: post?.reviewerNotes || "",
    disclosureKey: post?.disclosureKey || "educational-general",
    sourceReferences: post?.sourceReferences?.length ? post.sourceReferences : [],
    blocks: post?.blocks?.length
      ? post.blocks.map(normalizeBlock)
      : [baseBlock("lead", "block-1"), baseBlock("paragraph", "block-2")],
    seo: {
      title: post?.seo?.title || "",
      description: post?.seo?.description || "",
      canonicalUrl: post?.seo?.canonicalUrl || "",
      openGraphImage: post?.seo?.openGraphImage || "",
      allowIndexing: post?.seo?.allowIndexing !== false,
    },
  };
}

function slugify(value) {
  return String(value || "").toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 110);
}

function rowsToText(rows) {
  return (rows || []).map((row) => row.join(" | ")).join("\n");
}

function textToRows(value) {
  return String(value || "").split("\n").map((row) => row.split("|").map((cell) => cell.trim())).filter((row) => row.some(Boolean));
}

function countWords(blocks) {
  return blocks.reduce((sum, block) => {
    const content = `${block.title || ""} ${block.text || ""} ${(block.items || []).join(" ")} ${(block.rows || []).flat().join(" ")}`;
    return sum + content.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
}

function BlockEditor({ block, index, updateBlock, moveBlock, removeBlock }) {
  const textAreaClass = "w-full rounded-xl border border-gray-200 bg-white p-3 text-sm leading-6 outline-none focus:border-[#1F4ED8]";
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FAFBFD] p-4">
      <div className="mb-3 flex items-center gap-2">
        <select value={block.type} onChange={(event) => updateBlock(index, { ...baseBlock(event.target.value, block.id), type: event.target.value })} className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs font-bold">
          {BLOCK_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <div className="ml-auto flex gap-1">
          <button type="button" aria-label="Move block up" onClick={() => moveBlock(index, -1)} className="rounded-lg p-2 text-[#6B7280] hover:bg-white"><ArrowUp size={15} /></button>
          <button type="button" aria-label="Move block down" onClick={() => moveBlock(index, 1)} className="rounded-lg p-2 text-[#6B7280] hover:bg-white"><ArrowDown size={15} /></button>
          <button type="button" aria-label="Delete block" onClick={() => removeBlock(index)} className="rounded-lg p-2 text-[#E53935] hover:bg-red-50"><Trash2 size={15} /></button>
        </div>
      </div>

      {block.type === "divider" && <div className="my-6 h-px bg-gradient-to-r from-transparent via-[#1F4ED8]/35 to-transparent" />}

      {["lead", "paragraph", "quote", "disclaimer", "heading2", "heading3"].includes(block.type) && (
        <textarea rows={block.type.startsWith("heading") ? 2 : 5} value={block.text || ""} onChange={(event) => updateBlock(index, { text: event.target.value })} placeholder={block.type.startsWith("heading") ? "Section heading" : "Write the content for this block"} className={`${textAreaClass} ${block.type.startsWith("heading") ? "font-serif text-xl font-bold" : ""}`} />
      )}

      {block.type === "callout" && <div className="space-y-3"><input value={block.title || ""} onChange={(event) => updateBlock(index, { title: event.target.value })} placeholder="Callout title" className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#1F4ED8]" /><textarea rows="5" value={block.text || ""} onChange={(event) => updateBlock(index, { text: event.target.value })} placeholder="Callout content" className={textAreaClass} /></div>}

      {block.type === "list" && <textarea rows="6" value={(block.items || []).join("\n")} onChange={(event) => updateBlock(index, { items: event.target.value.split("\n") })} placeholder="One list item per line" className={textAreaClass} />}

      {block.type === "image" && (
        <div className="space-y-3">
          {block.url && <div className="aspect-[16/9] overflow-hidden rounded-xl bg-white"><img src={block.url} alt={block.altText || ""} className="h-full w-full object-cover" style={{ objectPosition: `${block.focalX}% ${block.focalY}%` }} /></div>}
          <MediaUploadField value={block.url} altText={block.altText} onUploaded={(media) => updateBlock(index, { url: media.url, altText: media.altText || block.altText, caption: media.caption || block.caption })} />
          <input value={block.url || ""} onChange={(event) => updateBlock(index, { url: event.target.value })} placeholder="Or paste an image URL" className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#1F4ED8]" />
          <textarea rows="2" value={block.altText || ""} onChange={(event) => updateBlock(index, { altText: event.target.value })} placeholder="Alternative text — required before publishing" className={textAreaClass} />
          <input value={block.caption || ""} onChange={(event) => updateBlock(index, { caption: event.target.value })} placeholder="Caption (optional)" className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none" />
          <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold text-[#6B7280]">Horizontal focus {block.focalX}%<input type="range" min="0" max="100" value={block.focalX} onChange={(event) => updateBlock(index, { focalX: Number(event.target.value) })} className="mt-1 w-full accent-[#1F4ED8]" /></label><label className="text-xs font-semibold text-[#6B7280]">Vertical focus {block.focalY}%<input type="range" min="0" max="100" value={block.focalY} onChange={(event) => updateBlock(index, { focalY: Number(event.target.value) })} className="mt-1 w-full accent-[#1F4ED8]" /></label></div>
        </div>
      )}

      {block.type === "table" && (
        <div className="space-y-3">
          <input value={(block.headers || []).join(" | ")} onChange={(event) => updateBlock(index, { headers: event.target.value.split("|").map((cell) => cell.trim()) })} placeholder="Column 1 | Column 2 | Column 3" className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#1F4ED8]" />
          <textarea rows="7" value={rowsToText(block.rows)} onChange={(event) => updateBlock(index, { rows: textToRows(event.target.value) })} placeholder={"Row 1 cell 1 | Row 1 cell 2\nRow 2 cell 1 | Row 2 cell 2"} className={textAreaClass} />
          <p className="text-xs text-[#6B7280]">Use a vertical bar (|) to separate columns and a new line for each row.</p>
        </div>
      )}

      {block.type === "cta" && (
        <div className="space-y-3"><input value={block.title || ""} onChange={(event) => updateBlock(index, { title: event.target.value })} placeholder="CTA heading" className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold outline-none" /><textarea rows="3" value={block.text || ""} onChange={(event) => updateBlock(index, { text: event.target.value })} placeholder="CTA supporting message" className={textAreaClass} /><div className="grid gap-3 sm:grid-cols-2"><input value={block.buttonLabel || ""} onChange={(event) => updateBlock(index, { buttonLabel: event.target.value })} placeholder="Button label" className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm" /><input value={block.buttonHref || ""} onChange={(event) => updateBlock(index, { buttonHref: event.target.value })} placeholder="/contact" className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm" /></div><select value={block.variant || "primary"} onChange={(event) => updateBlock(index, { variant: event.target.value })} className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm"><option value="primary">Primary Blue</option><option value="secondary">Outline</option><option value="gold">Insight Gold</option></select></div>
      )}

      {block.type === "video" && <div className="space-y-3"><input value={block.url || ""} onChange={(event) => updateBlock(index, { url: event.target.value })} placeholder="YouTube or Vimeo URL" className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none" /><input value={block.caption || ""} onChange={(event) => updateBlock(index, { caption: event.target.value })} placeholder="Video caption (optional)" className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm" /></div>}
    </div>
  );
}

export function InsightEditor({ post = null, categories = [], tags = [], authors = [], canPublish = false }) {
  const router = useRouter();
  const [form, setForm] = useState(() => normalizeInitial(post));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const isEditing = Boolean(post?.id);
  const wordCount = useMemo(() => countWords(form.blocks), [form.blocks]);
  const readingTime = Math.max(1, Math.ceil(wordCount / 210));

  function updateField(name, value) { setForm((current) => ({ ...current, [name]: value })); }
  function updateNested(group, name, value) { setForm((current) => ({ ...current, [group]: { ...current[group], [name]: value } })); }
  function updateBlock(index, patch) { setForm((current) => ({ ...current, blocks: current.blocks.map((block, blockIndex) => blockIndex === index ? { ...block, ...patch } : block) })); }
  function addBlock(type) { setForm((current) => ({ ...current, blocks: [...current.blocks, createBlock(type)] })); }
  function moveBlock(index, direction) { const target = index + direction; if (target < 0 || target >= form.blocks.length) return; setForm((current) => { const blocks = [...current.blocks]; [blocks[index], blocks[target]] = [blocks[target], blocks[index]]; return { ...current, blocks }; }); }
  function removeBlock(index) { if (form.blocks.length === 1) return; setForm((current) => ({ ...current, blocks: current.blocks.filter((_, blockIndex) => blockIndex !== index) })); }
  function addSource() { updateField("sourceReferences", [...form.sourceReferences, { label: "", url: "" }]); }
  function updateSource(index, patch) { updateField("sourceReferences", form.sourceReferences.map((source, sourceIndex) => sourceIndex === index ? { ...source, ...patch } : source)); }

  async function save(nextStatus = form.status) {
    setBusy(true); setError(""); setSavedMessage("");
    try {
      const selectedAuthor = authors.find((author) => author.id === form.authorId);
      const payload = { ...form, status: nextStatus, slug: form.slug || slugify(form.title), authorName: selectedAuthor?.name || form.authorName, readingTime, scheduledAt: nextStatus === "scheduled" ? form.scheduledAt : form.scheduledAt || null };
      const response = await fetch(isEditing ? `/api/admin/insights/${post.id}` : "/api/admin/insights", { method: isEditing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save this Insight.");
      setForm((current) => ({ ...current, status: result.post.status, slug: result.post.slug, publishedAt: result.post.publishedAt?.slice(0, 16) || current.publishedAt }));
      const labels = { published: "Insight published successfully.", scheduled: "Insight scheduled successfully.", in_review: "Insight submitted for review.", approved: "Insight approved.", draft: "Draft saved." };
      setSavedMessage(labels[nextStatus] || "Insight saved successfully.");
      if (!isEditing) router.replace(`/admin/insights/${result.post.id}/edit`); else router.refresh();
    } catch (saveError) { setError(saveError?.message || "Unable to save this Insight."); } finally { setBusy(false); }
  }

  return (
    <div className="pb-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/insights" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] hover:text-[#1F4ED8]"><ArrowLeft size={17} /> All Insights</Link>
        <div className="flex flex-wrap items-center gap-2">
          {isEditing && <Link href={`/admin/insights/${post.id}/history`} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold"><History size={16} /> History</Link>}
          {isEditing && <Link href={`/admin/insights/${post.id}/preview`} target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold"><Eye size={16} /> Preview</Link>}
          <button type="button" disabled={busy} onClick={() => save("draft")} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold hover:bg-gray-50 disabled:opacity-60"><Save size={16} /> Save draft</button>
          {!canPublish && <button type="button" disabled={busy} onClick={() => save("in_review")} className="inline-flex items-center gap-2 rounded-xl bg-[#F5B301] px-5 py-2.5 text-sm font-bold text-[#0B0B0F] disabled:opacity-60"><Send size={16} /> Submit for review</button>}
          {canPublish && <button type="button" disabled={busy} onClick={() => save(form.status === "scheduled" ? "scheduled" : "published")} className="inline-flex items-center gap-2 rounded-xl bg-[#1F4ED8] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" /> : form.status === "scheduled" ? <CalendarClock size={16} /> : <Save size={16} />} {form.status === "scheduled" ? "Schedule" : "Publish"}</button>}
        </div>
      </div>

      {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {savedMessage && <p role="status" className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{savedMessage}</p>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
            <label htmlFor="insight-title" className="text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280]">Insight title</label>
            <textarea id="insight-title" rows="2" value={form.title} onChange={(event) => { updateField("title", event.target.value); if (!isEditing && !form.slug) updateField("slug", slugify(event.target.value)); }} placeholder="Write a clear, human title" className="mt-3 w-full resize-none border-0 p-0 font-serif text-3xl font-bold leading-tight outline-none placeholder:text-gray-300 sm:text-4xl" />
            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"><div><label htmlFor="insight-slug" className="mb-2 block text-sm font-semibold">URL slug</label><input id="insight-slug" value={form.slug} onChange={(event) => updateField("slug", slugify(event.target.value))} className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#1F4ED8]" /></div><span className="pb-3 text-xs text-[#6B7280]">/insights/{form.slug || "your-insight"}</span></div>
            <div className="mt-5"><label htmlFor="insight-excerpt" className="mb-2 block text-sm font-semibold">Short excerpt</label><textarea id="insight-excerpt" rows="3" maxLength="500" value={form.excerpt} onChange={(event) => updateField("excerpt", event.target.value)} className="w-full rounded-xl border border-gray-200 p-4 text-sm leading-6 outline-none focus:border-[#1F4ED8]" placeholder="Explain what the reader will understand from this Insight." /><div className="mt-1 text-right text-xs text-[#6B7280]">{form.excerpt.length}/500</div></div>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl font-bold">Article content</h2><p className="mt-1 text-sm text-[#6B7280]">{wordCount} words · approximately {readingTime} min read</p></div><select onChange={(event) => { if (event.target.value) { addBlock(event.target.value); event.target.value = ""; } }} defaultValue="" className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold"><option value="" disabled>Add content block</option>{BLOCK_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
            <div className="space-y-4">{form.blocks.map((block, index) => <BlockEditor key={block.id} block={block} index={index} updateBlock={updateBlock} moveBlock={moveBlock} removeBlock={removeBlock} />)}</div>
            <button type="button" onClick={() => addBlock("paragraph")} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-dashed border-[#1F4ED8]/40 px-4 py-3 text-sm font-bold text-[#1F4ED8] hover:bg-blue-50"><Plus size={16} /> Add paragraph</button>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between"><div><h2 className="font-serif text-2xl font-bold">Sources and references</h2><p className="mt-1 text-sm text-[#6B7280]">Add reliable references for factual claims, market data or external research.</p></div><button type="button" onClick={addSource} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-[#1F4ED8]"><Plus size={14} /> Add source</button></div><div className="mt-5 space-y-3">{form.sourceReferences.map((source, index) => <div key={`source-${index}`} className="grid gap-2 rounded-xl bg-[#F4F6F9] p-3 sm:grid-cols-[0.8fr_1.2fr_auto]"><input value={source.label || ""} onChange={(event) => updateSource(index, { label: event.target.value })} placeholder="Source title" className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm" /><input value={source.url || ""} onChange={(event) => updateSource(index, { url: event.target.value })} placeholder="https://" className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm" /><button type="button" aria-label="Remove source" onClick={() => updateField("sourceReferences", form.sourceReferences.filter((_, sourceIndex) => sourceIndex !== index))} className="rounded-lg p-2 text-[#E53935]"><Trash2 size={16} /></button></div>)}{!form.sourceReferences.length && <p className="rounded-xl bg-[#F4F6F9] p-4 text-sm text-[#6B7280]">No references added yet.</p>}</div></section>

          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7"><h2 className="font-serif text-2xl font-bold">Search and social preview</h2><div className="mt-5 space-y-4"><div><label className="mb-2 block text-sm font-semibold">SEO title</label><input value={form.seo.title} onChange={(event) => updateNested("seo", "title", event.target.value)} maxLength="70" className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#1F4ED8]" /><p className="mt-1 text-right text-xs text-[#6B7280]">{form.seo.title.length}/70</p></div><div><label className="mb-2 block text-sm font-semibold">Meta description</label><textarea rows="3" value={form.seo.description} onChange={(event) => updateNested("seo", "description", event.target.value)} maxLength="170" className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-[#1F4ED8]" /><p className="mt-1 text-right text-xs text-[#6B7280]">{form.seo.description.length}/170</p></div><div><label className="mb-2 block text-sm font-semibold">Canonical URL</label><input value={form.seo.canonicalUrl} onChange={(event) => updateNested("seo", "canonicalUrl", event.target.value)} placeholder="Leave blank to use the GrowVest article URL" className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#1F4ED8]" /></div><div><label className="mb-2 block text-sm font-semibold">Open Graph image URL</label><input value={form.seo.openGraphImage} onChange={(event) => updateNested("seo", "openGraphImage", event.target.value)} placeholder="Defaults to featured image" className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#1F4ED8]" /></div><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.seo.allowIndexing} onChange={(event) => updateNested("seo", "allowIndexing", event.target.checked)} className="h-4 w-4 accent-[#1F4ED8]" /> Allow search engines to index this Insight</label><div className="rounded-xl border border-gray-200 p-4"><p className="text-xs text-emerald-700">growvest.info › insights › {form.slug || "your-insight"}</p><p className="mt-1 text-lg text-[#1F4ED8]">{form.seo.title || form.title || "Insight title"}</p><p className="mt-1 text-sm leading-5 text-[#6B7280]">{form.seo.description || form.excerpt || "Your meta description will appear here."}</p></div></div></section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><h2 className="font-serif text-xl font-bold">Publishing</h2><div className="mt-4 space-y-4"><div><label className="mb-2 block text-sm font-semibold">Status</label><select value={form.status} onChange={(event) => updateField("status", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none" disabled={!canPublish && ["approved", "scheduled", "published"].includes(form.status)}>{STATUS_OPTIONS.filter(([value]) => canPublish || !["approved", "scheduled", "published"].includes(value)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>{form.status === "scheduled" && <div><label className="mb-2 block text-sm font-semibold">Schedule date and time</label><input type="datetime-local" value={form.scheduledAt} onChange={(event) => updateField("scheduledAt", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /><p className="mt-1 text-xs text-[#6B7280]">Use India Standard Time for publishing.</p></div>}<div><label className="mb-2 block text-sm font-semibold">Review due date</label><input type="date" value={form.reviewDueAt} onChange={(event) => updateField("reviewDueAt", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></div><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.isFeatured} onChange={(event) => updateField("isFeatured", event.target.checked)} className="h-4 w-4 accent-[#F5B301]" /> Feature this Insight</label><div><label className="mb-2 block text-sm font-semibold">Reviewer notes</label><textarea rows="4" value={form.reviewerNotes} onChange={(event) => updateField("reviewerNotes", event.target.value)} className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none" /></div></div></section>

          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><h2 className="font-serif text-xl font-bold">Organisation</h2><div className="mt-4 space-y-4"><div><label className="mb-2 block text-sm font-semibold">Author</label><select value={form.authorId} onChange={(event) => updateField("authorId", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm"><option value="">Select author</option>{authors.filter((author) => author.isActive !== false).map((author) => <option key={author.id} value={author.id}>{author.name}</option>)}</select></div><div><p className="mb-2 text-sm font-semibold">Categories</p><div className="space-y-2">{categories.filter((category) => category.isActive !== false).map((category) => <label key={category.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.categoryIds.includes(category.id)} onChange={(event) => updateField("categoryIds", event.target.checked ? [...form.categoryIds, category.id] : form.categoryIds.filter((id) => id !== category.id))} className="h-4 w-4 accent-[#1F4ED8]" />{category.name}</label>)}</div></div><div><label className="mb-2 block text-sm font-semibold">Tags</label><input value={form.tagIds.join(", ")} onChange={(event) => updateField("tagIds", event.target.value.split(",").map((value) => slugify(value)).filter(Boolean))} placeholder="goal-planning, family, review" className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /><p className="mt-1 text-xs text-[#6B7280]">Separate tags with commas.</p>{tags.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{tags.filter((tag) => tag.isActive !== false).slice(0, 12).map((tag) => <button key={tag.id} type="button" onClick={() => updateField("tagIds", form.tagIds.includes(tag.id) ? form.tagIds.filter((id) => id !== tag.id) : [...form.tagIds, tag.id])} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${form.tagIds.includes(tag.id) ? "bg-[#1F4ED8] text-white" : "bg-[#F4F6F9] text-[#6B7280]"}`}>{tag.name}</button>)}</div>}</div></div></section>

          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><ImageIcon size={19} className="text-[#1F4ED8]" /><h2 className="font-serif text-xl font-bold">Featured image</h2></div><div className="mt-4 space-y-4">{form.featuredImage.url && <div className="aspect-[16/10] overflow-hidden rounded-xl bg-[#F4F6F9]"><img src={form.featuredImage.url} alt={form.featuredImage.altText || ""} className="h-full w-full object-cover" style={{ objectPosition: `${form.featuredImage.focalX}% ${form.featuredImage.focalY}%` }} /></div>}<MediaUploadField value={form.featuredImage.url} altText={form.featuredImage.altText} onUploaded={(media) => setForm((current) => ({ ...current, featuredImage: { ...current.featuredImage, url: media.url, altText: media.altText || current.featuredImage.altText, caption: media.caption || current.featuredImage.caption } }))} /><div><label className="mb-2 block text-sm font-semibold">Image URL</label><input value={form.featuredImage.url} onChange={(event) => updateNested("featuredImage", "url", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></div><div><label className="mb-2 block text-sm font-semibold">Alternative text</label><textarea rows="3" value={form.featuredImage.altText} onChange={(event) => updateNested("featuredImage", "altText", event.target.value)} placeholder="Required before publishing when an image is used" className="w-full rounded-xl border border-gray-200 p-3 text-sm" /></div><div><label className="mb-2 block text-sm font-semibold">Caption</label><input value={form.featuredImage.caption} onChange={(event) => updateNested("featuredImage", "caption", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></div><label className="block text-xs font-semibold text-[#6B7280]">Horizontal focus {form.featuredImage.focalX}%<input type="range" min="0" max="100" value={form.featuredImage.focalX} onChange={(event) => updateNested("featuredImage", "focalX", Number(event.target.value))} className="mt-1 w-full accent-[#1F4ED8]" /></label><label className="block text-xs font-semibold text-[#6B7280]">Vertical focus {form.featuredImage.focalY}%<input type="range" min="0" max="100" value={form.featuredImage.focalY} onChange={(event) => updateNested("featuredImage", "focalY", Number(event.target.value))} className="mt-1 w-full accent-[#1F4ED8]" /></label></div></section>
        </aside>
      </div>
    </div>
  );
}
