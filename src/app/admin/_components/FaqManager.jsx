"use client";

import { useMemo, useState } from "react";
import { LoaderCircle, Pencil, Plus, Save, Trash2, X } from "lucide-react";

const EMPTY = { question: "", answer: "", category: "General", displayOrder: 0, status: "draft", isVisible: true };

export function FaqManager({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category).filter(Boolean))).sort(), [items]);

  function reset() {
    setForm(EMPTY);
    setEditingId("");
    setError("");
  }

  function edit(item) {
    setForm({ ...EMPTY, ...item });
    setEditingId(item.id);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(editingId ? `/api/admin/faqs/${editingId}` : "/api/admin/faqs", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save the FAQ.");
      setItems((current) => editingId ? current.map((item) => item.id === editingId ? result.item : item) : [...current, result.item]);
      reset();
    } catch (saveError) {
      setError(saveError?.message || "Unable to save the FAQ.");
    } finally {
      setBusy(false);
    }
  }

  async function archive(item) {
    if (!window.confirm(`Archive “${item.question}”?`)) return;
    const response = await fetch(`/api/admin/faqs/${item.id}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) return setError(result.error || "Unable to archive the FAQ.");
    setItems((current) => current.map((entry) => entry.id === item.id ? result.item : entry));
  }

  return (
    <div>
      <div className="mb-7"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Website Content</p><h1 className="mt-2 font-serif text-4xl font-bold">FAQs</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">Create approved questions and answers. Every save writes directly to Firestore.</p></div>
      <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
        <form onSubmit={save} className="h-fit rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="font-serif text-xl font-bold">{editingId ? "Edit FAQ" : "Add FAQ"}</h2>{editingId ? <button type="button" onClick={reset} className="rounded-lg p-2 text-[#6B7280] hover:bg-gray-100"><X size={17} /></button> : null}</div>
          <div className="mt-5 space-y-4"><div><label className="mb-2 block text-sm font-semibold">Question *</label><textarea required rows={3} value={form.question} onChange={(event) => setForm((current) => ({ ...current, question: event.target.value }))} className="min-h-[90px] w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" /></div><div><label className="mb-2 block text-sm font-semibold">Approved answer *</label><textarea required rows={8} value={form.answer} onChange={(event) => setForm((current) => ({ ...current, answer: event.target.value }))} className="min-h-[180px] w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" /></div><div><label className="mb-2 block text-sm font-semibold">Category</label><input list="faq-categories" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /><datalist id="faq-categories">{categories.map((category) => <option key={category} value={category} />)}</datalist></div><div className="grid grid-cols-2 gap-3"><div><label className="mb-2 block text-sm font-semibold">Display order</label><input type="number" min="0" value={form.displayOrder} onChange={(event) => setForm((current) => ({ ...current, displayOrder: Number(event.target.value) }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></div><div><label className="mb-2 block text-sm font-semibold">Status</label><select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div></div><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.isVisible} onChange={(event) => setForm((current) => ({ ...current, isVisible: event.target.checked }))} className="h-4 w-4 accent-[#1F4ED8]" />Visible on public FAQ page</label>{error ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}<button type="submit" disabled={busy} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" /> : editingId ? <Save size={16} /> : <Plus size={16} />} {editingId ? "Save changes" : "Add FAQ"}</button></div>
        </form>
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"><div className="border-b border-black/5 px-5 py-4"><h2 className="font-serif text-xl font-bold">FAQ directory</h2><p className="mt-1 text-xs text-[#6B7280]">{items.length} question{items.length === 1 ? "" : "s"}</p></div><div className="divide-y divide-black/5">{[...items].sort((a,b)=>(a.displayOrder||0)-(b.displayOrder||0)).map((item) => <article key={item.id} className="px-5 py-4"><div className="flex gap-4"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-[#0B0B0F]">{item.question}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${item.status === "published" ? "bg-emerald-50 text-emerald-700" : item.status === "archived" ? "bg-gray-100 text-gray-600" : "bg-amber-50 text-amber-700"}`}>{item.status}</span></div><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B7280]">{item.answer}</p><p className="mt-2 text-xs font-semibold text-[#1F4ED8]">{item.category} · Order {item.displayOrder || 0}</p></div><div className="flex gap-2"><button type="button" onClick={() => edit(item)} className="h-9 rounded-lg border border-gray-200 p-2 text-[#1F4ED8]"><Pencil size={15} /></button><button type="button" onClick={() => archive(item)} className="h-9 rounded-lg border border-red-100 p-2 text-red-500"><Trash2 size={15} /></button></div></div></article>)}{!items.length ? <div className="px-5 py-16 text-center text-sm text-[#6B7280]">No FAQs have been pushed to the database yet.</div> : null}</div></div>
      </div>
    </div>
  );
}
