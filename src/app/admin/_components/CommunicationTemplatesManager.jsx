"use client";

import { useMemo, useState } from "react";
import { Archive, CheckCircle2, FileText, History, LoaderCircle, Mail, MessageCircle, Plus, RotateCcw, Save, Search, Sparkles, X } from "lucide-react";

const EMPTY = {
  key: "",
  name: "",
  description: "",
  channel: "email",
  module: "enquiries",
  trigger: "manual",
  subject: "",
  body: "",
  variables: [],
  status: "draft",
  isEnabled: true,
};

function statusLabel(value) {
  return String(value || "draft").replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function TemplateDialog({ item, open, onClose, onSaved }) {
  const [form, setForm] = useState(item ? { ...EMPTY, ...item, variables: item.variables || [] } : EMPTY);
  const [variablesText, setVariablesText] = useState((item?.variables || []).join(", "));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!open) return null;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = { ...form, variables: variablesText.split(",").map((value) => value.trim()).filter(Boolean) };
      const url = item ? `/api/admin/communication-templates/${encodeURIComponent(item.id)}` : "/api/admin/communication-templates";
      const response = await fetch(url, { method: item ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save the communication template.");
      onSaved(result.item);
      onClose();
    } catch (saveError) {
      setError(saveError?.message || "Unable to save the communication template.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="fixed inset-0 z-[80] flex items-center justify-center p-4"><button type="button" aria-label="Close dialog" className="absolute inset-0 bg-black/55" onClick={onClose}/><form onSubmit={submit} className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Communication governance</p><h2 className="mt-2 font-serif text-3xl font-bold">{item ? "Edit template" : "Add template"}</h2><p className="mt-2 text-sm text-[#6B7280]">Use approved variables such as <code>{"{{leadName}}"}</code> and <code>{"{{advisorName}}"}</code>.</p></div><button type="button" onClick={onClose} className="rounded-xl border border-gray-200 p-2 text-[#6B7280]"><X size={18}/></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Template name<input required value={form.name} onChange={(event)=>setForm({...form,name:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal"/></label><label className="text-sm font-semibold">Stable key<input required disabled={Boolean(item)} value={form.key} onChange={(event)=>setForm({...form,key:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal disabled:bg-gray-50" placeholder="enquiry_follow_up"/></label><label className="text-sm font-semibold">Channel<select value={form.channel} onChange={(event)=>setForm({...form,channel:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 font-normal"><option value="email">Email</option><option value="whatsapp">WhatsApp</option></select></label><label className="text-sm font-semibold">Status<select value={form.status} onChange={(event)=>setForm({...form,status:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 font-normal"><option value="draft">Draft</option><option value="review">Review</option><option value="approved">Approved</option><option value="archived">Archived</option></select></label><label className="text-sm font-semibold">Module<input value={form.module} onChange={(event)=>setForm({...form,module:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal"/></label><label className="text-sm font-semibold">Trigger<input value={form.trigger} onChange={(event)=>setForm({...form,trigger:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal"/></label></div><label className="mt-4 block text-sm font-semibold">Description<textarea rows={2} value={form.description} onChange={(event)=>setForm({...form,description:event.target.value})} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal"/></label>{form.channel === "email" ? <label className="mt-4 block text-sm font-semibold">Subject<input required value={form.subject} onChange={(event)=>setForm({...form,subject:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal"/></label> : null}<label className="mt-4 block text-sm font-semibold">Message body<textarea required rows={10} value={form.body} onChange={(event)=>setForm({...form,body:event.target.value})} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-mono text-sm font-normal leading-6"/></label><label className="mt-4 block text-sm font-semibold">Allowed variables<input value={variablesText} onChange={(event)=>setVariablesText(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal" placeholder="leadName, advisorName, goal"/></label><label className="mt-4 flex items-center gap-3 rounded-xl bg-[#F4F6F9] p-3 text-sm"><input type="checkbox" checked={form.isEnabled} onChange={(event)=>setForm({...form,isEnabled:event.target.checked})} className="h-4 w-4 accent-[#1F4ED8]"/>Template is enabled for use</label>{error?<p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>:null}<button disabled={busy} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white disabled:opacity-60">{busy?<LoaderCircle size={17} className="animate-spin"/>:<Save size={17}/>}Save template</button></form></div>;
}

function VersionHistoryDialog({ item, open, canManage, onClose, onRestored }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState("");
  const [error, setError] = useState("");

  async function load() {
    if (!item?.id) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/communication-templates/${encodeURIComponent(item.id)}/versions`, { cache: "no-store" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to load template history.");
      setVersions(result.items || []);
    } catch (loadError) {
      setError(loadError?.message || "Unable to load template history.");
    } finally {
      setLoading(false);
    }
  }

  async function restore(version) {
    if (!window.confirm(`Restore version ${version.version} of ${item.name}? The current template will be saved in history first.`)) return;
    setRestoring(version.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/communication-templates/${encodeURIComponent(item.id)}/versions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ versionId: version.id }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to restore this version.");
      onRestored(result.item);
      await load();
    } catch (restoreError) {
      setError(restoreError?.message || "Unable to restore this version.");
    } finally {
      setRestoring("");
    }
  }

  if (!open || !item) return null;
  return <div className="fixed inset-0 z-[90] flex items-center justify-center p-4"><button type="button" aria-label="Close version history" className="absolute inset-0 bg-black/55" onClick={onClose}/><section className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Version history</p><h2 className="mt-2 font-serif text-3xl font-bold">{item.name}</h2><p className="mt-2 text-sm text-[#6B7280]">Each saved change preserves the previous approved wording and workflow state.</p></div><button type="button" onClick={onClose} className="rounded-xl border border-gray-200 p-2 text-[#6B7280]"><X size={18}/></button></div><button type="button" onClick={load} disabled={loading} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-[#1F4ED8]">{loading?<LoaderCircle size={16} className="animate-spin"/>:<History size={16}/>}Load history</button>{error?<p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>:null}<div className="mt-5 space-y-3">{versions.map((version)=><article key={version.id} className="rounded-2xl border border-gray-100 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Version {version.version}</p><p className="mt-1 text-xs text-[#6B7280]">Saved {formatDate(version.createdAt)} by {version.createdByName}</p><p className="mt-2 line-clamp-2 text-xs leading-5 text-[#6B7280]">{version.snapshot?.subject || version.snapshot?.body}</p></div>{canManage?<button type="button" onClick={()=>restore(version)} disabled={Boolean(restoring)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-bold text-[#1F4ED8] disabled:opacity-50">{restoring===version.id?<LoaderCircle size={14} className="animate-spin"/>:<RotateCcw size={14}/>}Restore</button>:null}</div></article>)}{!loading&&!versions.length?<p className="rounded-xl bg-[#F4F6F9] p-4 text-sm text-[#6B7280]">No previous version exists yet. A version is created before the next save or restore.</p>:null}</div></section></div>;
}

export function CommunicationTemplatesManager({ initialItems = [], canManage = false }) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("all");
  const [editing, setEditing] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyItem, setHistoryItem] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const filtered = useMemo(() => items.filter((item) => (channel === "all" || item.channel === channel) && (!query || [item.name,item.key,item.description,item.trigger].join(" ").toLowerCase().includes(query.toLowerCase()))), [items, query, channel]);

  function upsert(item) {
    setItems((current) => [item, ...current.filter((entry) => entry.id !== item.id)].sort((a,b)=>new Date(b.updatedAt||0)-new Date(a.updatedAt||0)));
  }

  async function seed() {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/communication-templates/seed", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ replace: false }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to add approved defaults.");
      const refresh = await fetch("/api/admin/communication-templates", { cache: "no-store" });
      const data = await refresh.json();
      setItems(data.items || []);
    } finally {
      setBusy(false);
    }
  }

  async function archive(item) {
    if (!window.confirm(`Archive ${item.name}?`)) return;
    const response = await fetch(`/api/admin/communication-templates/${encodeURIComponent(item.id)}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Unable to archive the template.");
    upsert(result.item);
  }

  return <div><div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Communication governance</p><h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Communication templates</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B7280]">Manage approved email and WhatsApp wording, variables, triggers and versioned review status.</p></div>{canManage?<div className="flex flex-wrap gap-2"><button type="button" onClick={seed} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-[#1F4ED8]"><Sparkles size={16}/>Add approved defaults</button><button type="button" onClick={()=>{setEditing(null);setDialogOpen(true);}} className="inline-flex items-center gap-2 rounded-xl bg-[#1F4ED8] px-5 py-3 text-sm font-bold text-white"><Plus size={16}/>Add template</button></div>:null}</div><div className="rounded-2xl border border-black/5 bg-white shadow-sm"><div className="grid gap-3 border-b border-black/5 p-4 sm:grid-cols-[1fr_180px]"><label className="relative"><Search size={16} className="absolute left-3 top-3.5 text-[#6B7280]"/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search template name, key or trigger" className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-sm"/></label><select value={channel} onChange={(event)=>setChannel(event.target.value)} className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm"><option value="all">All channels</option><option value="email">Email</option><option value="whatsapp">WhatsApp</option></select></div><div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((item)=>{const Icon=item.channel==="email"?Mail:MessageCircle;return <article key={item.id} className="rounded-2xl border border-gray-100 p-5"><div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F4ED8]/10 text-[#1F4ED8]"><Icon size={18}/></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${item.status==="approved"?"bg-emerald-50 text-emerald-700":"bg-gray-100 text-gray-600"}`}>{statusLabel(item.status)}</span></div><h2 className="mt-4 font-serif text-xl font-bold">{item.name}</h2><p className="mt-1 font-mono text-[11px] text-[#6B7280]">{item.key}</p><p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6B7280]">{item.description || item.body}</p><div className="mt-4 flex items-center justify-between text-[10px] text-[#9CA3AF]"><span>Version {item.version}</span><span>{formatDate(item.updatedAt)}</span></div>{canManage?<div className="mt-4 flex gap-2"><button type="button" onClick={()=>{setEditing(item);setDialogOpen(true);}} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-bold text-[#1F4ED8]"><FileText size={14}/>Edit</button><button type="button" onClick={()=>{setHistoryItem(item);setHistoryOpen(true);}} className="rounded-xl border border-gray-200 p-2.5 text-[#1F4ED8]" title="Version history"><History size={14}/></button>{item.status!=="archived"?<button type="button" onClick={()=>archive(item)} className="rounded-xl border border-gray-200 p-2.5 text-[#6B7280]"><Archive size={14}/></button>:<span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={14}/>Archived</span>}</div>:null}</article>})}{!filtered.length?<div className="col-span-full py-14 text-center"><FileText size={30} className="mx-auto text-[#9CA3AF]"/><h2 className="mt-4 font-serif text-2xl font-bold">No templates found.</h2><p className="mt-2 text-sm text-[#6B7280]">Add approved defaults or create a template for a communication trigger.</p></div>:null}</div></div><TemplateDialog key={editing?.id || "new"} item={editing} open={dialogOpen} onClose={()=>setDialogOpen(false)} onSaved={upsert}/><VersionHistoryDialog key={historyItem?.id || "history"} item={historyItem} open={historyOpen} canManage={canManage} onClose={()=>setHistoryOpen(false)} onRestored={(item)=>{upsert(item);setHistoryItem(item);}}/></div>;
}
