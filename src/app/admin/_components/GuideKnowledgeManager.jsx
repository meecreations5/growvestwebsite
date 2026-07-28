"use client";

import { useMemo, useState } from "react";
import { Archive, BookCheck, LoaderCircle, Pencil, Plus, RefreshCw, Save, Search, X } from "lucide-react";

const EMPTY = {
  question: "",
  answer: "",
  category: "General",
  keywords: [],
  sourceUrl: "",
  sourceLabel: "",
  status: "draft",
  displayOrder: 0,
  isVisible: true,
};

export function GuideKnowledgeManager({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [busy, setBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    const sorted = [...items].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || String(a.question || "").localeCompare(String(b.question || "")));
    if (!value) return sorted;
    return sorted.filter((item) => `${item.question} ${item.answer} ${item.category} ${(item.keywords || []).join(" ")}`.toLowerCase().includes(value));
  }, [items, query]);

  function reset() {
    setForm(EMPTY);
    setEditingId("");
    setError("");
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({ ...EMPTY, ...item, keywords: item.keywords || [] });
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(editingId ? `/api/admin/growvest-guide/knowledge/${editingId}` : "/api/admin/growvest-guide/knowledge", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save this approved answer.");
      setItems((current) => editingId ? current.map((item) => item.id === editingId ? result.item : item) : [...current, result.item]);
      setNotice(editingId ? "Approved answer updated." : "Approved answer created.");
      reset();
    } catch (saveError) {
      setError(saveError?.message || "Unable to save this approved answer.");
    } finally {
      setBusy(false);
    }
  }

  async function archive(item) {
    if (!window.confirm(`Archive “${item.question}”? It will stop being used by GrowVest Guide.`)) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/growvest-guide/knowledge/${item.id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to archive this answer.");
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: "archived", isVisible: false } : entry));
      setNotice("Approved answer archived.");
    } catch (archiveError) {
      setError(archiveError?.message || "Unable to archive this answer.");
    } finally {
      setBusy(false);
    }
  }

  async function seedDefaults() {
    setSeeding(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/growvest-guide/seed", { method: "POST" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to push approved defaults.");
      const refresh = await fetch("/api/admin/growvest-guide/knowledge", { cache: "no-store" });
      const refreshed = await refresh.json().catch(() => ({}));
      if (refresh.ok) setItems(refreshed.items || []);
      setNotice(`${result.created || 0} approved answer(s) added; ${result.skipped || 0} already existed.`);
    } catch (seedError) {
      setError(seedError?.message || "Unable to push approved defaults.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Approved Knowledge</p><h1 className="mt-2 font-serif text-4xl font-bold">GrowVest Guide answers</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">Create reviewed questions and answers. Published records are used alongside published FAQs, Goal Library content and Insights.</p></div>
        <button type="button" onClick={seedDefaults} disabled={seeding} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#1F4ED8]/25 bg-white px-4 text-sm font-bold text-[#1F4ED8] shadow-sm disabled:opacity-60">{seeding ? <LoaderCircle size={16} className="animate-spin" /> : <RefreshCw size={16} />} Push approved defaults</button>
      </div>

      {(error || notice) ? <div className={`mb-5 rounded-xl px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{error || notice}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
        <form onSubmit={save} className="h-fit rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="font-serif text-xl font-bold">{editingId ? "Edit approved answer" : "Add approved answer"}</h2>{editingId ? <button type="button" onClick={reset} className="rounded-lg p-2 text-[#6B7280] hover:bg-gray-100"><X size={17} /></button> : null}</div>
          <div className="mt-5 space-y-4">
            <div><label className="mb-2 block text-sm font-semibold">Question *</label><textarea required rows={3} value={form.question} onChange={(event) => setForm((current) => ({ ...current, question: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" placeholder="What can a visitor ask?" /></div>
            <div><label className="mb-2 block text-sm font-semibold">Approved answer *</label><textarea required rows={7} value={form.answer} onChange={(event) => setForm((current) => ({ ...current, answer: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-6" placeholder="Write only reviewed GrowVest information." /></div>
            <div className="grid gap-3 sm:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold">Category</label><input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></div><div><label className="mb-2 block text-sm font-semibold">Display order</label><input type="number" min="0" value={form.displayOrder} onChange={(event) => setForm((current) => ({ ...current, displayOrder: Number(event.target.value) }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></div></div>
            <div><label className="mb-2 block text-sm font-semibold">Keywords</label><input value={(form.keywords || []).join(", ")} onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" placeholder="fees, charges, cost" /><p className="mt-1 text-[11px] text-[#6B7280]">Comma-separated phrases improve natural-language matching.</p></div>
            <div className="grid gap-3 sm:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold">Source label</label><input value={form.sourceLabel} onChange={(event) => setForm((current) => ({ ...current, sourceLabel: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" placeholder="About GrowVest" /></div><div><label className="mb-2 block text-sm font-semibold">Source URL</label><input value={form.sourceUrl} onChange={(event) => setForm((current) => ({ ...current, sourceUrl: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" placeholder="/about" /></div></div>
            <div className="grid gap-3 sm:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold">Status</label><select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div><label className="mt-7 flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.isVisible !== false} onChange={(event) => setForm((current) => ({ ...current, isVisible: event.target.checked }))} className="h-4 w-4 accent-[#1F4ED8]" />Available to Guide</label></div>
            <button type="submit" disabled={busy} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" /> : editingId ? <Save size={16} /> : <Plus size={16} />} {editingId ? "Save changes" : "Add answer"}</button>
          </div>
        </form>

        <div className="rounded-2xl border border-black/5 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-black/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-serif text-xl font-bold">Knowledge library</h2><p className="mt-1 text-xs text-[#6B7280]">{items.filter((item) => item.status === "published" && item.isVisible !== false).length} published answers</p></div><label className="relative"><Search size={15} className="absolute left-3 top-3 text-[#6B7280]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search answers" className="h-10 w-full rounded-xl border border-gray-200 pl-9 pr-3 text-sm sm:w-64" /></label></div>
          <div className="divide-y divide-black/5">
            {filtered.map((item) => <article key={item.id} className="p-5"><div className="flex items-start gap-4"><div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#1F4ED8]/8 text-[#1F4ED8]"><BookCheck size={18} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{item.question}</h3><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.status === "published" && item.isVisible !== false ? "bg-emerald-50 text-emerald-700" : item.status === "archived" ? "bg-gray-100 text-gray-600" : "bg-amber-50 text-amber-700"}`}>{item.status === "published" && item.isVisible !== false ? "Published" : item.status}</span></div><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6B7280]">{item.answer}</p><div className="mt-3 flex flex-wrap gap-1.5"><span className="rounded-full bg-[#F4F6F9] px-2 py-1 text-[10px] font-semibold text-[#6B7280]">{item.category || "General"}</span>{(item.keywords || []).slice(0, 5).map((keyword) => <span key={keyword} className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-[#1F4ED8]">{keyword}</span>)}</div></div><div className="flex flex-none gap-2"><button type="button" onClick={() => edit(item)} className="rounded-lg border border-gray-200 p-2 text-[#1F4ED8] hover:bg-blue-50"><Pencil size={15} /></button>{item.status !== "archived" ? <button type="button" onClick={() => archive(item)} className="rounded-lg border border-gray-200 p-2 text-[#E53935] hover:bg-red-50"><Archive size={15} /></button> : null}</div></div></article>)}
            {!filtered.length ? <div className="px-5 py-16 text-center"><BookCheck size={30} className="mx-auto text-[#6B7280]" /><h3 className="mt-4 font-serif text-2xl font-bold">No matching approved answers.</h3><p className="mt-2 text-sm text-[#6B7280]">Add an answer or push the approved defaults.</p></div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
