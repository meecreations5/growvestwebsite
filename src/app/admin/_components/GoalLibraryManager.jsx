"use client";

import { useState } from "react";
import { LoaderCircle, Pencil, Plus, Save, Trash2, X } from "lucide-react";

const EMPTY = { label: "", slug: "", iconKey: "target", color: "#1F4ED8", horizon: "", typical: "", monthlySip: "", description: "", why: "", keySteps: [], watchOuts: [], displayOrder: 0, status: "draft", isVisible: true };
const ICONS = ["target", "graduation-cap", "home", "star", "shield", "plane", "trending-up", "heart", "globe", "dollar-sign"];

function listText(value) { return Array.isArray(value) ? value.join("\n") : ""; }
function parseList(value) { return String(value || "").split("\n").map((item) => item.trim()).filter(Boolean); }

export function GoalLibraryManager({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(EMPTY);
  const [steps, setSteps] = useState("");
  const [watchOuts, setWatchOuts] = useState("");
  const [editingId, setEditingId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function reset() { setForm(EMPTY); setSteps(""); setWatchOuts(""); setEditingId(""); setError(""); }
  function edit(item) { setForm({ ...EMPTY, ...item }); setSteps(listText(item.keySteps)); setWatchOuts(listText(item.watchOuts)); setEditingId(item.id); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); }

  async function save(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const payload = { ...form, keySteps: parseList(steps), watchOuts: parseList(watchOuts) };
      const response = await fetch(editingId ? `/api/admin/goal-library/${editingId}` : "/api/admin/goal-library", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save the goal.");
      setItems((current) => editingId ? current.map((item) => item.id === editingId ? result.item : item) : [...current, result.item]);
      reset();
    } catch (saveError) { setError(saveError?.message || "Unable to save the goal."); } finally { setBusy(false); }
  }

  async function archive(item) {
    if (!window.confirm(`Archive ${item.label}?`)) return;
    const response = await fetch(`/api/admin/goal-library/${item.id}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) return setError(result.error || "Unable to archive the goal.");
    setItems((current) => current.map((entry) => entry.id === item.id ? result.item : entry));
  }

  return (
    <div>
      <div className="mb-7"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Website Content</p><h1 className="mt-2 font-serif text-4xl font-bold">Goal Library</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">Manage public goal guides and push approved content directly into Firestore.</p></div>
      <div className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
        <form onSubmit={save} className="h-fit rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-serif text-xl font-bold">{editingId ? "Edit goal" : "Add goal"}</h2>{editingId ? <button type="button" onClick={reset} className="rounded-lg p-2 text-[#6B7280]"><X size={17} /></button> : null}</div><div className="mt-5 space-y-4"><div><label className="mb-2 block text-sm font-semibold">Goal name *</label><input required value={form.label} onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></div><div className="grid grid-cols-2 gap-3"><div><label className="mb-2 block text-sm font-semibold">Icon</label><select value={form.iconKey} onChange={(event) => setForm((current) => ({ ...current, iconKey: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm">{ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}</select></div><div><label className="mb-2 block text-sm font-semibold">Brand colour</label><input type="color" value={form.color} onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 bg-white p-1" /></div></div><div className="grid grid-cols-3 gap-2"><div><label className="mb-2 block text-xs font-semibold">Horizon</label><input value={form.horizon} onChange={(event) => setForm((current) => ({ ...current, horizon: event.target.value }))} className="h-10 w-full rounded-xl border border-gray-200 px-2 text-xs" /></div><div><label className="mb-2 block text-xs font-semibold">Corpus range</label><input value={form.typical} onChange={(event) => setForm((current) => ({ ...current, typical: event.target.value }))} className="h-10 w-full rounded-xl border border-gray-200 px-2 text-xs" /></div><div><label className="mb-2 block text-xs font-semibold">Monthly range</label><input value={form.monthlySip} onChange={(event) => setForm((current) => ({ ...current, monthlySip: event.target.value }))} className="h-10 w-full rounded-xl border border-gray-200 px-2 text-xs" /></div></div><div><label className="mb-2 block text-sm font-semibold">About this goal</label><textarea rows={5} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="min-h-[120px] w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" /></div><div><label className="mb-2 block text-sm font-semibold">Why it matters</label><textarea rows={5} value={form.why} onChange={(event) => setForm((current) => ({ ...current, why: event.target.value }))} className="min-h-[120px] w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" /></div><div><label className="mb-2 block text-sm font-semibold">Key steps</label><textarea rows={6} value={steps} onChange={(event) => setSteps(event.target.value)} className="min-h-[140px] w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" placeholder="One step per line" /></div><div><label className="mb-2 block text-sm font-semibold">Watch-outs</label><textarea rows={5} value={watchOuts} onChange={(event) => setWatchOuts(event.target.value)} className="min-h-[120px] w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" placeholder="One point per line" /></div><div className="grid grid-cols-2 gap-3"><div><label className="mb-2 block text-sm font-semibold">Display order</label><input type="number" min="0" value={form.displayOrder} onChange={(event) => setForm((current) => ({ ...current, displayOrder: Number(event.target.value) }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></div><div><label className="mb-2 block text-sm font-semibold">Status</label><select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div></div><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.isVisible} onChange={(event) => setForm((current) => ({ ...current, isVisible: event.target.checked }))} className="h-4 w-4 accent-[#1F4ED8]" />Visible on public Goal Library</label>{error ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}<button type="submit" disabled={busy} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" /> : editingId ? <Save size={16} /> : <Plus size={16} />} {editingId ? "Save changes" : "Add goal"}</button></div></form>
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"><div className="border-b border-black/5 px-5 py-4"><h2 className="font-serif text-xl font-bold">Goal directory</h2><p className="mt-1 text-xs text-[#6B7280]">{items.length} goal{items.length === 1 ? "" : "s"}</p></div><div className="divide-y divide-black/5">{[...items].sort((a,b)=>(a.displayOrder||0)-(b.displayOrder||0)).map((item) => <article key={item.id} className="flex items-start gap-4 px-5 py-4"><div className="mt-1 h-10 w-10 flex-none rounded-xl" style={{ background: `${item.color || "#1F4ED8"}20`, border: `1px solid ${item.color || "#1F4ED8"}45` }} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{item.label}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${item.status === "published" ? "bg-emerald-50 text-emerald-700" : item.status === "archived" ? "bg-gray-100 text-gray-600" : "bg-amber-50 text-amber-700"}`}>{item.status}</span></div><p className="mt-1 text-xs text-[#6B7280]">{item.horizon} · {item.typical} · Order {item.displayOrder || 0}</p><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B7280]">{item.description}</p></div><div className="flex gap-2"><button type="button" onClick={() => edit(item)} className="rounded-lg border border-gray-200 p-2 text-[#1F4ED8]"><Pencil size={15} /></button><button type="button" onClick={() => archive(item)} className="rounded-lg border border-red-100 p-2 text-red-500"><Trash2 size={15} /></button></div></article>)}{!items.length ? <div className="px-5 py-16 text-center text-sm text-[#6B7280]">No goals have been pushed to the database yet.</div> : null}</div></div>
      </div>
    </div>
  );
}
