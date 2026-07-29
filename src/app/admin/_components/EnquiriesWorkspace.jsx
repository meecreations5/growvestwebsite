"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, CalendarClock, ChevronLeft, ChevronRight, CircleCheck, Filter, Inbox, LoaderCircle, Mail, MessageCircle, Plus, Search, Target, UserRoundPlus, UsersRound, X } from "lucide-react";
import { LeadStatusBadge, PriorityBadge } from "./LeadStatusBadge";

const STATUS_OPTIONS = [
  ["all", "All statuses"], ["new", "New"], ["new_email_attention_required", "New · Email attention"], ["submission_error", "Submission error"], ["assigned", "Assigned"], ["contact_attempted", "Contact attempted"], ["connected", "Connected"], ["follow_up", "Follow-up"], ["qualified", "Qualified"], ["converted", "Converted"], ["closed", "Closed"], ["not_interested", "Not interested"], ["duplicate", "Duplicate"], ["invalid", "Invalid"], ["spam", "Spam"], ["subscribed", "Subscribed"], ["pending_provider_sync", "Pending provider sync"], ["provider_sync_failed", "Provider sync failed"],
];

const SOURCE_OPTIONS = [["all", "All enquiry types"], ["contact", "Contact & discovery"], ["bucket", "Bucket List"], ["newsletter", "Newsletter"], ["whatsapp", "WhatsApp"]];
const PRIORITY_OPTIONS = [["all", "All priorities"], ["urgent", "Urgent"], ["high", "High"], ["normal", "Normal"], ["low", "Low"]];

function formatDate(value, withTime = true) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", withTime ? { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" } : { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function sourceIcon(item) {
  if (item.sourceKey === "bucket") return Target;
  if (item.sourceKey === "newsletter") return Mail;
  if (item.enquiryType === "whatsapp") return MessageCircle;
  return Inbox;
}

function isDue(value) {
  return value && new Date(value).getTime() <= Date.now();
}

function ManualLeadDialog({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", enquiryType: "whatsapp", serviceArea: "", message: "", priority: "normal", consentAccepted: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!open) return null;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to create this lead.");
      onCreated(result.item);
      onClose();
    } catch (saveError) {
      setError(saveError?.message || "Unable to create this lead.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"><button type="button" aria-label="Close" className="absolute inset-0 bg-black/55" onClick={onClose}/><form onSubmit={submit} className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Manual capture</p><h2 className="mt-2 font-serif text-3xl font-bold">Add an enquiry</h2><p className="mt-2 text-sm text-[#6B7280]">Use this for a WhatsApp, referral, phone or walk-in conversation.</p></div><button type="button" onClick={onClose} className="rounded-xl border border-gray-200 p-2 text-[#6B7280]"><X size={18}/></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Full name *<input required value={form.fullName} onChange={(event)=>setForm({...form,fullName:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal"/></label><label className="text-sm font-semibold">Lead type<select value={form.enquiryType} onChange={(event)=>setForm({...form,enquiryType:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 font-normal"><option value="whatsapp">WhatsApp</option><option value="discovery_conversation">Discovery conversation</option><option value="referral">Referral</option><option value="manual">Phone or walk-in</option><option value="other">Other</option></select></label><label className="text-sm font-semibold">Email<input type="email" value={form.email} onChange={(event)=>setForm({...form,email:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal"/></label><label className="text-sm font-semibold">Phone<input value={form.phone} onChange={(event)=>setForm({...form,phone:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal" placeholder="+91..."/></label><label className="text-sm font-semibold">Area of interest<input value={form.serviceArea} onChange={(event)=>setForm({...form,serviceArea:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal"/></label><label className="text-sm font-semibold">Priority<select value={form.priority} onChange={(event)=>setForm({...form,priority:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 font-normal"><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option><option value="low">Low</option></select></label></div><label className="mt-4 block text-sm font-semibold">Conversation summary<textarea rows={4} value={form.message} onChange={(event)=>setForm({...form,message:event.target.value})} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal"/></label><label className="mt-4 flex items-start gap-3 rounded-xl bg-[#F4F6F9] p-3 text-xs leading-5 text-[#6B7280]"><input type="checkbox" checked={form.consentAccepted} onChange={(event)=>setForm({...form,consentAccepted:event.target.checked})} className="mt-0.5 h-4 w-4 accent-[#1F4ED8]"/>The person has agreed that GrowVest may contact them. Keep this unchecked when consent has not yet been recorded.</label>{error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}<button disabled={busy} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white disabled:opacity-60">{busy?<LoaderCircle size={17} className="animate-spin"/>:<UserRoundPlus size={17}/>}Create enquiry</button></form></div>;
}

export function EnquiriesWorkspace({ initialResult, initialFilters = {}, assignees = [], title = "Enquiries & leads", description = "Manage every website enquiry from first contact to investor handoff.", showAnalytics = true, canManage = false }) {
  const [result, setResult] = useState(initialResult);
  const [filters, setFilters] = useState({ source: "all", status: "all", priority: "all", assignee: "all", search: "", followUp: "all", page: 1, pageSize: 25, ...initialFilters });
  const [busy, setBusy] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const stats = result.stats || {};

  async function load(next = {}) {
    const updated = { ...filters, ...next };
    setFilters(updated);
    setBusy(true);
    try {
      const parameters = new URLSearchParams(Object.entries(updated).filter(([,value])=>value !== "" && value != null).map(([key,value])=>[key,String(value)]));
      const response = await fetch(`/api/admin/enquiries?${parameters.toString()}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load enquiries.");
      setResult(data);
    } finally {
      setBusy(false);
    }
  }

  const cards = useMemo(() => [
    { label: "New enquiries", value: stats.new || 0, icon: Inbox, color: "#1F4ED8" },
    { label: "Follow-ups due", value: stats.followUpsDue || 0, icon: CalendarClock, color: "#E53935" },
    { label: "Bucket List leads", value: stats.bucketList || 0, icon: Target, color: "#F5B301" },
    { label: "Converted", value: stats.converted || 0, icon: CircleCheck, color: "#16A34A" },
  ], [stats]);

  const conversionRate = stats.total ? Math.round(((stats.converted || 0) / stats.total) * 100) : 0;
  return <div><div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Client acquisition</p><h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">{description}</p></div>{canManage?<button type="button" onClick={()=>setManualOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] px-5 py-3 text-sm font-bold text-white"><Plus size={17}/>Add enquiry</button>:null}</div>

    {showAnalytics ? <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({label,value,icon:Icon,color})=><div key={label} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{background:`${color}14`,color}}><Icon size={20}/></div><p className="mt-5 font-serif text-4xl font-bold">{value}</p><p className="mt-1 text-sm text-[#6B7280]">{label}</p></div>)}</div><div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]"><div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-serif text-xl font-bold">Lead mix</h2><span className="text-xs text-[#6B7280]">{stats.total || 0} total</span></div><div className="mt-5 space-y-3">{[["Contact & discovery",stats.discovery||0,"#1F4ED8"],["Bucket List",stats.bucketList||0,"#F5B301"],["Newsletter",stats.newsletter||0,"#6B7280"],["WhatsApp",stats.whatsapp||0,"#16A34A"]].map(([label,value,color])=><div key={label}><div className="mb-1.5 flex justify-between text-xs"><span>{label}</span><strong>{value}</strong></div><div className="h-2 overflow-hidden rounded-full bg-[#F4F6F9]"><div className="h-full rounded-full" style={{width:`${stats.total?Math.max(2,Math.round((value/stats.total)*100)):0}%`,background:color}}/></div></div>)}</div></div><div className="rounded-2xl border border-black/5 bg-[#0B0B0F] p-5 text-white shadow-sm"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Current conversion</p><p className="mt-4 font-serif text-5xl font-bold text-[#F5B301]">{conversionRate}%</p><p className="mt-2 text-sm leading-6 text-white/60">{stats.converted || 0} converted from {stats.total || 0} captured enquiries.</p><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/5 p-3"><p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/35">Avg. first response</p><p className="mt-1 text-sm font-bold">{stats.averageFirstResponseHours == null ? "Not available" : `${stats.averageFirstResponseHours} hrs`}</p></div><div className="rounded-xl bg-white/5 p-3"><p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/35">Response overdue</p><p className="mt-1 text-sm font-bold">{stats.firstResponseOverdue || 0}</p></div></div><Link href="/admin/enquiries?status=qualified" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">Review qualified leads <ArrowRight size={15}/></Link></div></div></> : null}

    <div className="mt-7 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"><div className="border-b border-black/5 p-4 sm:p-5"><form onSubmit={(event)=>{event.preventDefault();load({page:1});}} className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_repeat(5,minmax(130px,auto))_auto]"><label className="relative"><Search size={16} className="pointer-events-none absolute left-3 top-3.5 text-[#6B7280]"/><input value={filters.search} onChange={(event)=>setFilters({...filters,search:event.target.value})} placeholder="Search name, email, phone or reference" className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-sm"/></label><select value={filters.source} onChange={(event)=>load({source:event.target.value,page:1})} className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm">{SOURCE_OPTIONS.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select><select value={filters.status} onChange={(event)=>load({status:event.target.value,page:1})} className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm">{STATUS_OPTIONS.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select><select value={filters.priority} onChange={(event)=>load({priority:event.target.value,page:1})} className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm">{PRIORITY_OPTIONS.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select><select value={filters.assignee} onChange={(event)=>load({assignee:event.target.value,page:1})} className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm"><option value="all">All assignees</option><option value="unassigned">Unassigned</option>{assignees.map((item)=><option key={item.uid} value={item.uid}>{item.displayName}</option>)}</select><select value={filters.followUp} onChange={(event)=>load({followUp:event.target.value,page:1})} className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm"><option value="all">All follow-ups</option><option value="due">Due now</option><option value="scheduled">Scheduled</option></select><button disabled={busy} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-bold text-[#1F4ED8]">{busy?<LoaderCircle size={16} className="animate-spin"/>:<Filter size={16}/>}Apply</button></form></div>

      <div className="overflow-x-auto"><table className="min-w-[1080px] w-full text-left"><thead className="bg-[#F8F9FB] text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B7280]"><tr><th className="px-5 py-3">Enquiry</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Assigned to</th><th className="px-4 py-3">Follow-up</th><th className="px-4 py-3">Received</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-black/5">{result.items.map((item)=>{const Icon=sourceIcon(item);return <tr key={item.leadKey} className="hover:bg-[#F8F9FB]"><td className="px-5 py-4"><div className="flex items-start gap-3"><div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#1F4ED8]/8 text-[#1F4ED8]"><Icon size={17}/></div><div className="min-w-0"><p className="font-semibold text-[#0B0B0F]">{item.fullName}</p><p className="mt-1 truncate text-xs text-[#6B7280]">{item.email || item.phone || item.requestId}</p><p className="mt-1 text-[10px] text-[#9CA3AF]">{item.requestId}</p></div></div></td><td className="px-4 py-4 text-sm text-[#6B7280]">{item.sourceLabel}</td><td className="px-4 py-4"><LeadStatusBadge status={item.status}/></td><td className="px-4 py-4"><PriorityBadge priority={item.priority}/></td><td className="px-4 py-4 text-sm text-[#6B7280]">{item.assignedToName || "Unassigned"}</td><td className="px-4 py-4"><p className={`text-xs font-semibold ${isDue(item.followUpAt)?"text-red-600":"text-[#6B7280]"}`}>{item.followUpAt?formatDate(item.followUpAt):"Not scheduled"}</p>{isDue(item.followUpAt)?<span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-red-600"><AlertTriangle size={11}/>Due</span>:null}</td><td className="px-4 py-4 text-xs text-[#6B7280]">{formatDate(item.createdAt)}</td><td className="px-5 py-4 text-right"><Link href={`/admin/enquiries/${encodeURIComponent(item.leadKey)}`} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-[#1F4ED8] hover:bg-blue-50">Open <ArrowRight size={13}/></Link></td></tr>})}</tbody></table>{!result.items.length?<div className="px-5 py-16 text-center"><UsersRound size={30} className="mx-auto text-[#9CA3AF]"/><h3 className="mt-4 font-serif text-2xl font-bold">No enquiries match these filters.</h3><p className="mt-2 text-sm text-[#6B7280]">Try a broader search or clear one of the filters.</p></div>:null}</div>
      <div className="flex flex-col gap-3 border-t border-black/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-[#6B7280]">Showing {result.items.length} of {result.total} matching enquiries</p><div className="flex items-center gap-2"><button type="button" disabled={busy||result.page<=1} onClick={()=>load({page:result.page-1})} className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"><ChevronLeft size={16}/></button><span className="px-2 text-xs font-semibold">Page {result.page} of {result.totalPages}</span><button type="button" disabled={busy||result.page>=result.totalPages} onClick={()=>load({page:result.page+1})} className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"><ChevronRight size={16}/></button></div></div></div>
    <ManualLeadDialog open={manualOpen} onClose={()=>setManualOpen(false)} onCreated={(item)=>setResult((current)=>({...current,items:[item,...current.items].slice(0,current.pageSize),total:current.total+1,stats:{...current.stats,total:(current.stats.total||0)+1,new:(current.stats.new||0)+1,whatsapp:(current.stats.whatsapp||0)+(item.enquiryType==="whatsapp"?1:0)}}))}/>
  </div>;
}
