"use client";

import { useState } from "react";
import { LoaderCircle, Pencil, Plus, Save, Share2, X } from "lucide-react";
import { SOCIAL_PLATFORMS } from "../../data/teamSocial";

const EMPTY = {
  platform: "linkedin",
  label: "LinkedIn",
  handle: "",
  url: "",
  displayOrder: 0,
  isVisible: true,
  openInNewTab: true,
  locations: { footer: true, about: false, contact: false, mobileMenu: false },
};

export function SocialMediaManager({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setForm(EMPTY);
    setEditingId("");
    setError("");
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({ ...EMPTY, ...item, locations: { ...EMPTY.locations, ...(item.locations || {}) } });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(editingId ? `/api/admin/social-media/${editingId}` : "/api/admin/social-media", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save this social account.");
      setItems((current) => editingId ? current.map((item) => item.id === editingId ? result.item : item) : [...current, result.item]);
      reset();
    } catch (saveError) {
      setError(saveError?.message || "Unable to save this social account.");
    } finally {
      setBusy(false);
    }
  }

  function selectPlatform(value) {
    const label = SOCIAL_PLATFORMS.find((item) => item.value === value)?.label || "Social profile";
    setForm((current) => ({ ...current, platform: value, label: editingId || current.label !== SOCIAL_PLATFORMS.find((item) => item.value === current.platform)?.label ? current.label : label }));
  }

  return (
    <div>
      <div className="mb-7"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Website Connections</p><h1 className="mt-2 font-serif text-4xl font-bold">Social media</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">Manage active GrowVest channels and choose where each account appears across the website.</p></div>
      <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
        <form onSubmit={save} className="h-fit rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="font-serif text-xl font-bold">{editingId ? "Edit account" : "Add account"}</h2>{editingId ? <button type="button" onClick={reset} className="rounded-lg p-2 text-[#6B7280] hover:bg-gray-100"><X size={17} /></button> : null}</div>
          <div className="mt-5 space-y-4">
            <div><label className="mb-2 block text-sm font-semibold">Platform</label><select value={form.platform} onChange={(event) => selectPlatform(event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm">{SOCIAL_PLATFORMS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
            <div><label className="mb-2 block text-sm font-semibold">Accessible label</label><input required value={form.label} onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" placeholder="Follow GrowVest on LinkedIn" /></div>
            <div><label className="mb-2 block text-sm font-semibold">Profile URL *</label><input required type="url" value={form.url} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" placeholder="https://..." /></div>
            <div><label className="mb-2 block text-sm font-semibold">Handle or short label</label><input value={form.handle} onChange={(event) => setForm((current) => ({ ...current, handle: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" placeholder="@growvest" /></div>
            <div><label className="mb-2 block text-sm font-semibold">Display order</label><input type="number" min="0" value={form.displayOrder} onChange={(event) => setForm((current) => ({ ...current, displayOrder: Number(event.target.value) }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></div>
            <fieldset><legend className="mb-2 text-sm font-semibold">Display locations</legend><div className="grid grid-cols-2 gap-2">{[["footer","Footer"],["about","About page"],["contact","Contact page"],["mobileMenu","Mobile menu"]].map(([key,label]) => <label key={key} className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold"><input type="checkbox" checked={Boolean(form.locations?.[key])} onChange={(event) => setForm((current) => ({ ...current, locations: { ...current.locations, [key]: event.target.checked } }))} className="h-4 w-4 accent-[#1F4ED8]" />{label}</label>)}</div></fieldset>
            <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.isVisible} onChange={(event) => setForm((current) => ({ ...current, isVisible: event.target.checked }))} className="h-4 w-4 accent-[#1F4ED8]" />Active and visible</label>
            <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.openInNewTab} onChange={(event) => setForm((current) => ({ ...current, openInNewTab: event.target.checked }))} className="h-4 w-4 accent-[#1F4ED8]" />Open in a new tab</label>
            {error ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
            <button type="submit" disabled={busy} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" /> : editingId ? <Save size={16} /> : <Plus size={16} />} {editingId ? "Save changes" : "Add account"}</button>
          </div>
        </form>

        <div className="rounded-2xl border border-black/5 bg-white shadow-sm"><div className="border-b border-black/5 px-5 py-4"><h2 className="font-serif text-xl font-bold">Connected channels</h2></div><div className="divide-y divide-black/5">{[...items].sort((a,b)=>(a.displayOrder||0)-(b.displayOrder||0)).map((item) => <div key={item.id} className="flex items-start gap-4 px-5 py-4"><div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#1F4ED8]/8 text-[#1F4ED8]"><Share2 size={17} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{item.label}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.isVisible!==false?"bg-emerald-50 text-emerald-700":"bg-gray-100 text-gray-600"}`}>{item.isVisible!==false?"Visible":"Hidden"}</span></div><p className="mt-1 truncate text-xs text-[#6B7280]">{item.url}</p><div className="mt-2 flex flex-wrap gap-1.5">{Object.entries(item.locations||{}).filter(([,value])=>value).map(([key]) => <span key={key} className="rounded-full bg-[#F4F6F9] px-2 py-1 text-[10px] font-semibold text-[#6B7280]">{key.replace(/([A-Z])/g," $1")}</span>)}</div></div><button type="button" onClick={() => edit(item)} className="rounded-lg border border-gray-200 p-2 text-[#1F4ED8] hover:bg-blue-50"><Pencil size={16} /></button></div>)}{!items.length ? <div className="px-5 py-16 text-center"><Share2 size={28} className="mx-auto text-[#6B7280]" /><h3 className="mt-4 font-serif text-2xl font-bold">No social accounts connected.</h3><p className="mt-2 text-sm text-[#6B7280]">Add only active and officially managed GrowVest profiles.</p></div> : null}</div></div>
      </div>
    </div>
  );
}
