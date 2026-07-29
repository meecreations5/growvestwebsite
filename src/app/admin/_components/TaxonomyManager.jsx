"use client";

import { useState } from "react";
import { LoaderCircle, Pencil, Plus, Save, X } from "lucide-react";

const EMPTY = { name: "", slug: "", description: "", designation: "", bio: "", imageUrl: "", color: "#1F4ED8", displayOrder: 0, isActive: true };

function slugify(value) {
  return String(value || "").toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function TaxonomyManager({ type, initialItems, title, description }) {
  const [items, setItems] = useState(initialItems || []);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isAuthor = type === "authors";
  const isCategory = type === "categories";

  function reset() { setForm(EMPTY); setEditingId(""); setError(""); }
  function edit(item) { setEditingId(item.id); setForm({ ...EMPTY, ...item }); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); }

  async function save(event) {
    event.preventDefault();
    setBusy(true); setError("");
    const response = await fetch(`/api/admin/taxonomy/${type}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: editingId || undefined, slug: form.slug || slugify(form.name) }) });
    const result = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) { setError(result.error || "Unable to save this item."); return; }
    setItems((current) => editingId ? current.map((item) => item.id === editingId ? result.item : item) : [...current, result.item]);
    reset();
  }

  return <div>
    <div className="mb-7"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Insights & Blog</p><h1 className="mt-2 font-serif text-4xl font-bold">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">{description}</p></div>
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <form onSubmit={save} className="h-fit rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><h2 className="font-serif text-xl font-bold">{editingId ? "Edit item" : "Add new"}</h2>{editingId && <button type="button" onClick={reset} className="rounded-lg p-2 text-[#6B7280] hover:bg-gray-100"><X size={17}/></button>}</div>
        <div className="mt-5 space-y-4"><div><label className="mb-2 block text-sm font-semibold">Name</label><input required value={form.name} onChange={(event)=>setForm(current=>({...current,name:event.target.value,slug:current.slug||slugify(event.target.value)}))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#1F4ED8]"/></div><div><label className="mb-2 block text-sm font-semibold">Slug</label><input required value={form.slug} onChange={(event)=>setForm(current=>({...current,slug:slugify(event.target.value)}))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#1F4ED8]"/></div>
        {isAuthor ? <><div><label className="mb-2 block text-sm font-semibold">Designation</label><input value={form.designation} onChange={(event)=>setForm(current=>({...current,designation:event.target.value}))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm"/></div><div><label className="mb-2 block text-sm font-semibold">Biography</label><textarea rows="5" value={form.bio} onChange={(event)=>setForm(current=>({...current,bio:event.target.value}))} className="w-full rounded-xl border border-gray-200 p-3 text-sm"/></div><div><label className="mb-2 block text-sm font-semibold">Profile image URL</label><input value={form.imageUrl} onChange={(event)=>setForm(current=>({...current,imageUrl:event.target.value}))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm"/></div></> : <div><label className="mb-2 block text-sm font-semibold">Description</label><textarea rows="4" value={form.description} onChange={(event)=>setForm(current=>({...current,description:event.target.value}))} className="w-full rounded-xl border border-gray-200 p-3 text-sm"/></div>}
        {isCategory && <div><label className="mb-2 block text-sm font-semibold">Accent colour</label><input type="color" value={form.color || '#1F4ED8'} onChange={(event)=>setForm(current=>({...current,color:event.target.value}))} className="h-11 w-full rounded-xl border border-gray-200 p-1"/></div>}
        <div><label className="mb-2 block text-sm font-semibold">Display order</label><input type="number" value={form.displayOrder} onChange={(event)=>setForm(current=>({...current,displayOrder:Number(event.target.value)}))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm"/></div><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.isActive} onChange={(event)=>setForm(current=>({...current,isActive:event.target.checked}))} className="h-4 w-4 accent-[#1F4ED8]"/> Active and available</label>
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<button type="submit" disabled={busy} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white disabled:opacity-60">{busy?<LoaderCircle size={16} className="animate-spin"/>:editingId?<Save size={16}/>:<Plus size={16}/>} {editingId?"Save changes":"Add item"}</button></div>
      </form>
      <div className="rounded-2xl border border-black/5 bg-white shadow-sm"><div className="border-b border-black/5 px-5 py-4"><h2 className="font-serif text-xl font-bold">Current {title.toLowerCase()}</h2></div><div className="divide-y divide-black/5">{items.sort((a,b)=>(a.displayOrder||0)-(b.displayOrder||0)).map(item=><div key={item.id} className="flex items-start gap-4 px-5 py-4"><div className="mt-1 h-3 w-3 rounded-full" style={{background:item.color||'#1F4ED8'}}/><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{item.name}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.isActive!==false?'bg-emerald-50 text-emerald-700':'bg-gray-100 text-gray-600'}`}>{item.isActive!==false?'Active':'Hidden'}</span></div><p className="mt-1 text-xs text-[#6B7280]">/{item.slug}</p>{(item.description||item.bio) && <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B7280]">{item.description||item.bio}</p>}</div><button type="button" onClick={()=>edit(item)} className="rounded-lg border border-gray-200 p-2 text-[#1F4ED8] hover:bg-blue-50"><Pencil size={16}/></button></div>)}{!items.length&&<p className="px-5 py-12 text-center text-sm text-[#6B7280]">No items have been added yet.</p>}</div></div>
    </div>
  </div>;
}
