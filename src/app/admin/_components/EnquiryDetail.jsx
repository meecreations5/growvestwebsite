"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, CircleDollarSign, Clock3, Copy, ExternalLink, FileText, History, LoaderCircle, Mail, MessageCircle, Phone, Save, Send, ShieldAlert, Target, UserCheck, UserRound } from "lucide-react";
import { LeadStatusBadge, PriorityBadge, leadStatusLabel } from "./LeadStatusBadge";

const STATUS_OPTIONS = ["new", "new_email_attention_required", "submission_error", "assigned", "contact_attempted", "connected", "follow_up", "qualified", "converted", "closed", "not_interested", "duplicate", "invalid", "spam", "subscribed", "pending_provider_sync", "provider_sync_failed"];
const PRIORITY_OPTIONS = ["low", "normal", "high", "urgent"];

function formatDate(value, withTime = true) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", withTime ? { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" } : { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function toLocalInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function DetailItem({ label, children }) {
  return <div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9CA3AF]">{label}</p><div className="mt-1.5 text-sm leading-6 text-[#0B0B0F]">{children || "—"}</div></div>;
}

function activityIcon(action = "") {
  if (action.includes("email")) return Mail;
  if (action.includes("whatsapp")) return MessageCircle;
  if (action.includes("note")) return FileText;
  if (action.includes("converted")) return CheckCircle2;
  if (action.includes("created")) return UserRound;
  return History;
}

export function EnquiryDetail({ initialData, assignees = [], permissions = [] }) {
  const [lead, setLead] = useState(initialData.lead);
  const [notes, setNotes] = useState(initialData.notes || []);
  const [activities, setActivities] = useState(initialData.activities || []);
  const [communications, setCommunications] = useState(initialData.communications || []);
  const [form, setForm] = useState({
    status: initialData.lead.status || "new",
    priority: initialData.lead.priority || "normal",
    assignedTo: initialData.lead.assignedTo || "",
    followUpAt: toLocalInput(initialData.lead.followUpAt),
    nextAction: initialData.lead.nextAction || "",
    lostReason: initialData.lead.lostReason || "",
    tags: (initialData.lead.tags || []).join(", "),
  });
  const [note, setNote] = useState("");
  const [emailForm, setEmailForm] = useState({ subject: "Your GrowVest enquiry", message: "Thank you for connecting with GrowVest. We would like to understand your goals and priorities better. Please share a suitable time for a short conversation." });
  const [whatsappMessage, setWhatsappMessage] = useState(`Hello ${initialData.lead.fullName || "there"}, thank you for connecting with GrowVest. We would like to understand your goals and priorities better. Please share a convenient time for a short conversation.`);
  const [conversionNotes, setConversionNotes] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canManage = permissions.includes("enquiries.manage");
  const canCommunicate = permissions.includes("enquiries.communicate");
  const canConvert = permissions.includes("enquiries.convert");
  const selectedAssignee = useMemo(() => assignees.find((item) => item.uid === form.assignedTo), [assignees, form.assignedTo]);
  const leadPath = `/api/admin/enquiries/${encodeURIComponent(lead.leadKey)}`;

  function message(kind, text) {
    if (kind === "error") { setError(text); setSuccess(""); }
    else { setSuccess(text); setError(""); }
  }

  async function saveLead(event) {
    event.preventDefault();
    setBusy("save");
    message("success", "");
    try {
      const response = await fetch(leadPath, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          assignedToName: selectedAssignee?.displayName || "",
          assignedToEmail: selectedAssignee?.email || "",
          followUpAt: form.followUpAt ? new Date(form.followUpAt).toISOString() : "",
          tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save this enquiry.");
      setLead(result.item);
      message("success", "Enquiry details updated.");
      setActivities((current) => [{ id: `local-${Date.now()}`, action: "lead.updated", summary: "Updated enquiry details.", actorName: "Current admin", createdAt: new Date().toISOString() }, ...current]);
    } catch (saveError) {
      message("error", saveError?.message || "Unable to save this enquiry.");
    } finally {
      setBusy("");
    }
  }

  async function addNote(event) {
    event.preventDefault();
    setBusy("note");
    message("success", "");
    try {
      const response = await fetch(`${leadPath}/notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note, visibility: "team" }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save this note.");
      setNotes((current) => [result.note, ...current]);
      setNote("");
      message("success", "Internal note added.");
    } catch (noteError) {
      message("error", noteError?.message || "Unable to save this note.");
    } finally {
      setBusy("");
    }
  }

  async function sendEmail(event) {
    event.preventDefault();
    setBusy("email");
    message("success", "");
    try {
      const response = await fetch(`${leadPath}/communications/email`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(emailForm) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to send this email.");
      setCommunications((current) => [{ id: `local-${Date.now()}`, channel: "email", type: "admin_lead_follow_up", recipient: lead.email, subject: emailForm.subject, status: "sent", createdAt: new Date().toISOString() }, ...current]);
      if (["new", "new_email_attention_required"].includes(lead.status)) {
        setLead((current) => ({ ...current, status: "contact_attempted" }));
        setForm((current) => ({ ...current, status: "contact_attempted" }));
      }
      message("success", "Email sent through Brevo and added to communication history.");
    } catch (emailError) {
      message("error", emailError?.message || "Unable to send this email.");
    } finally {
      setBusy("");
    }
  }

  async function openWhatsapp(event) {
    event.preventDefault();
    setBusy("whatsapp");
    message("success", "");
    try {
      const response = await fetch(`${leadPath}/communications/whatsapp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: whatsappMessage }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to prepare WhatsApp.");
      setCommunications((current) => [{ id: `local-${Date.now()}`, channel: "whatsapp", type: "admin_whatsapp_handoff", recipient: lead.phone, status: "prepared", createdAt: new Date().toISOString() }, ...current]);
      window.open(result.url, "_blank", "noopener,noreferrer");
      if (["new", "new_email_attention_required"].includes(lead.status)) {
        setLead((current) => ({ ...current, status: "contact_attempted" }));
        setForm((current) => ({ ...current, status: "contact_attempted" }));
      }
      message("success", "WhatsApp opened and the handoff was logged.");
    } catch (whatsappError) {
      message("error", whatsappError?.message || "Unable to prepare WhatsApp.");
    } finally {
      setBusy("");
    }
  }

  async function convertLead() {
    if (!window.confirm("Create an investor handoff request and mark this enquiry as converted?")) return;
    setBusy("convert");
    message("success", "");
    try {
      const response = await fetch(`${leadPath}/convert`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes: conversionNotes }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to convert this enquiry.");
      setLead(result.lead);
      setForm((current) => ({ ...current, status: "converted", followUpAt: "" }));
      message("success", `Investor handoff created: ${result.conversionId}`);
    } catch (convertError) {
      message("error", convertError?.message || "Unable to convert this enquiry.");
    } finally {
      setBusy("");
    }
  }

  return <div>
    <Link href="/admin/enquiries" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#1F4ED8]"><ArrowLeft size={16}/>Back to enquiries</Link>
    <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><LeadStatusBadge status={lead.status}/><PriorityBadge priority={lead.priority}/><span className="rounded-full bg-[#F4F6F9] px-2.5 py-1 text-[10px] font-bold text-[#6B7280]">{lead.sourceLabel}</span></div><h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">{lead.fullName}</h1><p className="mt-2 text-sm text-[#6B7280]">Reference {lead.requestId} · Received {formatDate(lead.createdAt)}</p></div><div className="flex flex-wrap gap-2">{lead.email?<a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-[#1F4ED8]"><Mail size={16}/>Email</a>:null}{lead.phone?<a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-[#1F4ED8]"><Phone size={16}/>Call</a>:null}</div></div>

    {initialData.duplicates?.length ? <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="flex items-start gap-3"><ShieldAlert className="mt-0.5 flex-none text-amber-700" size={20}/><div><h2 className="font-bold text-amber-900">Possible duplicate or previous enquiry</h2><p className="mt-1 text-sm leading-6 text-amber-800">We found {initialData.duplicates.length} other record{initialData.duplicates.length===1?"":"s"} with the same email address or phone number.</p><div className="mt-3 flex flex-wrap gap-2">{initialData.duplicates.slice(0,5).map((item)=><Link key={item.leadKey} href={`/admin/enquiries/${encodeURIComponent(item.leadKey)}`} className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-amber-800 shadow-sm">{item.fullName} · {item.sourceLabel}</Link>)}</div></div></div></div> : null}

    {error?<p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>:null}{success?<p role="status" className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{success}</p>:null}

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F4ED8]/10 text-[#1F4ED8]"><UserRound size={19}/></div><div><h2 className="font-serif text-2xl font-bold">Enquiry details</h2><p className="text-xs text-[#6B7280]">Contact, source and intent captured from the website.</p></div></div><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><DetailItem label="Email">{lead.email?<a className="break-all text-[#1F4ED8]" href={`mailto:${lead.email}`}>{lead.email}</a>:"Not provided"}</DetailItem><DetailItem label="Phone">{lead.phone?<a className="text-[#1F4ED8]" href={`tel:${lead.phone}`}>{lead.phone}</a>:"Not provided"}</DetailItem><DetailItem label="Enquiry type">{lead.enquiryType.replaceAll("_"," ")}</DetailItem><DetailItem label="Service area">{lead.serviceArea || "Not selected"}</DetailItem><DetailItem label="Preferred slot">{lead.preferredSlot || "Not selected"}</DetailItem><DetailItem label="Source page">{lead.sourcePage || lead.referrer || "Not recorded"}</DetailItem></div>{lead.message?<div className="mt-6 rounded-xl bg-[#F4F6F9] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9CA3AF]">Visitor message</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#4B5563]">{lead.message}</p></div>:null}{Object.values(lead.campaign||{}).some(Boolean)?<div className="mt-5 grid gap-3 rounded-xl border border-gray-100 p-4 sm:grid-cols-3"><DetailItem label="Campaign source">{lead.campaign.source||"—"}</DetailItem><DetailItem label="Campaign medium">{lead.campaign.medium||"—"}</DetailItem><DetailItem label="Campaign name">{lead.campaign.campaign||"—"}</DetailItem></div>:null}</section>

        {lead.goals?.length ? <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5B301]/15 text-[#9A7000]"><Target size={19}/></div><div><h2 className="font-serif text-2xl font-bold">Bucket List goals</h2><p className="text-xs text-[#6B7280]">Illustrative data submitted through the Bucket List Builder.</p></div></div><div className="mt-5 overflow-x-auto"><table className="min-w-[620px] w-full text-left"><thead className="text-[10px] uppercase tracking-[0.13em] text-[#9CA3AF]"><tr><th className="pb-3">Goal</th><th className="pb-3">Target</th><th className="pb-3">Timeline</th><th className="pb-3">Estimate</th></tr></thead><tbody className="divide-y divide-black/5">{lead.goals.map((goal,index)=><tr key={`${goal.goalId||goal.label}-${index}`}><td className="py-3 font-semibold">{goal.label}</td><td className="py-3 text-sm text-[#6B7280]">{formatMoney(goal.corpus)}</td><td className="py-3 text-sm text-[#6B7280]">{goal.years} years</td><td className="py-3 text-sm font-semibold text-[#1F4ED8]">{formatMoney(goal.monthly)}/month</td></tr>)}</tbody></table></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-[#F4F6F9] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">Monthly estimate</p><p className="mt-2 text-lg font-bold">{formatMoney(lead.estimatedMonthlyInvestment)}</p></div><div className="rounded-xl bg-[#F4F6F9] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">Goal value</p><p className="mt-2 text-lg font-bold">{formatMoney(lead.totalValueOfSelectedGoals)}</p></div><div className="rounded-xl bg-[#F4F6F9] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">Assumed return</p><p className="mt-2 text-lg font-bold">{Math.round((lead.assumedAnnualReturn||0)*100)}% p.a.</p></div></div></section>:null}

        {canManage?<section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-2xl font-bold">Internal notes</h2><form onSubmit={addNote} className="mt-4"><textarea required rows={4} value={note} onChange={(event)=>setNote(event.target.value)} className="w-full rounded-xl border border-gray-200 p-3 text-sm" placeholder="Record a call outcome, family context, next step or internal observation."/><button disabled={busy==="note"} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#0B0B0F] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{busy==="note"?<LoaderCircle size={16} className="animate-spin"/>:<FileText size={16}/>}Add note</button></form><div className="mt-5 space-y-3">{notes.map((item)=><div key={item.id} className="rounded-xl bg-[#F4F6F9] p-4"><p className="whitespace-pre-wrap text-sm leading-6 text-[#4B5563]">{item.note}</p><p className="mt-2 text-[10px] font-semibold text-[#9CA3AF]">{item.createdByName||"GrowVest Team"} · {formatDate(item.createdAt)}</p></div>)}{!notes.length?<p className="text-sm text-[#9CA3AF]">No internal notes yet.</p>:null}</div></section>:null}

        {canCommunicate?<section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-2xl font-bold">Communication centre</h2><div className="mt-5 grid gap-5 lg:grid-cols-2"><form onSubmit={sendEmail} className="rounded-2xl border border-gray-100 p-4"><div className="flex items-center gap-2 font-bold"><Mail size={17} className="text-[#1F4ED8]"/>Send email</div><input disabled={!lead.email} value={emailForm.subject} onChange={(event)=>setEmailForm({...emailForm,subject:event.target.value})} className="mt-4 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" placeholder="Subject"/><textarea disabled={!lead.email} rows={6} value={emailForm.message} onChange={(event)=>setEmailForm({...emailForm,message:event.target.value})} className="mt-3 w-full rounded-xl border border-gray-200 p-3 text-sm"/><button disabled={!lead.email||busy==="email"} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{busy==="email"?<LoaderCircle size={16} className="animate-spin"/>:<Send size={16}/>}Send through Brevo</button>{!lead.email?<p className="mt-2 text-xs text-red-600">No email address is available.</p>:null}</form><form onSubmit={openWhatsapp} className="rounded-2xl border border-gray-100 p-4"><div className="flex items-center gap-2 font-bold"><MessageCircle size={17} className="text-emerald-600"/>Open WhatsApp</div><textarea disabled={!lead.phone} rows={8} value={whatsappMessage} onChange={(event)=>setWhatsappMessage(event.target.value)} className="mt-4 w-full rounded-xl border border-gray-200 p-3 text-sm"/><button disabled={!lead.phone||busy==="whatsapp"} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{busy==="whatsapp"?<LoaderCircle size={16} className="animate-spin"/>:<ExternalLink size={16}/>}Log and open WhatsApp</button>{!lead.phone?<p className="mt-2 text-xs text-red-600">No phone number is available.</p>:null}</form></div><div className="mt-6"><h3 className="text-sm font-bold">Communication history</h3><div className="mt-3 space-y-2">{communications.map((item)=><div key={item.id} className="flex items-start gap-3 rounded-xl bg-[#F4F6F9] p-3"><div className="mt-0.5">{item.channel==="whatsapp"?<MessageCircle size={15} className="text-emerald-600"/>:<Mail size={15} className="text-[#1F4ED8]"/>}</div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.subject||item.type?.replaceAll("_"," ")||item.channel}</p><p className="mt-1 truncate text-xs text-[#6B7280]">To {item.recipient} · {item.status}</p></div><span className="text-[10px] text-[#9CA3AF]">{formatDate(item.createdAt)}</span></div>)}{!communications.length?<p className="text-sm text-[#9CA3AF]">No communication history yet.</p>:null}</div></div></section>:null}
      </div>

      <aside className="space-y-6">
        <form onSubmit={saveLead} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><UserCheck size={19} className="text-[#1F4ED8]"/><h2 className="font-serif text-xl font-bold">Lead management</h2></div><div className="mt-5 space-y-4"><label className="block text-sm font-semibold">Status<select disabled={!canManage} value={form.status} onChange={(event)=>setForm({...form,status:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 font-normal">{STATUS_OPTIONS.map((status)=><option key={status} value={status}>{leadStatusLabel(status)}</option>)}</select></label><label className="block text-sm font-semibold">Priority<select disabled={!canManage} value={form.priority} onChange={(event)=>setForm({...form,priority:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 font-normal">{PRIORITY_OPTIONS.map((priority)=><option key={priority} value={priority}>{priority[0].toUpperCase()+priority.slice(1)}</option>)}</select></label><label className="block text-sm font-semibold">Assigned team member<select disabled={!canManage} value={form.assignedTo} onChange={(event)=>setForm({...form,assignedTo:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 font-normal"><option value="">Unassigned</option>{assignees.map((item)=><option key={item.uid} value={item.uid}>{item.displayName}</option>)}</select></label><label className="block text-sm font-semibold">Follow-up date and time<input disabled={!canManage} type="datetime-local" value={form.followUpAt} onChange={(event)=>setForm({...form,followUpAt:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal"/></label><label className="block text-sm font-semibold">Next action<textarea disabled={!canManage} rows={3} value={form.nextAction} onChange={(event)=>setForm({...form,nextAction:event.target.value})} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal" placeholder="Call, send plan, confirm meeting..."/></label><label className="block text-sm font-semibold">Tags<input disabled={!canManage} value={form.tags} onChange={(event)=>setForm({...form,tags:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal" placeholder="high intent, NRI, retirement"/></label>{["closed","not_interested","invalid","spam"].includes(form.status)?<label className="block text-sm font-semibold">Closure reason<textarea disabled={!canManage} rows={3} value={form.lostReason} onChange={(event)=>setForm({...form,lostReason:event.target.value})} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal"/></label>:null}{canManage?<button disabled={busy==="save"} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white disabled:opacity-60">{busy==="save"?<LoaderCircle size={16} className="animate-spin"/>:<Save size={16}/>}Save lead</button>:null}</div></form>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><Clock3 size={18} className="text-[#1F4ED8]"/><h2 className="font-serif text-xl font-bold">Timeline</h2></div><div className="mt-5 space-y-4">{activities.map((item)=>{const Icon=activityIcon(item.action);return <div key={item.id} className="flex gap-3"><div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#F4F6F9] text-[#1F4ED8]"><Icon size={14}/></div><div><p className="text-sm font-semibold leading-5">{item.summary||item.action?.replaceAll("_"," ")}</p><p className="mt-1 text-[10px] text-[#9CA3AF]">{item.actorName||"System"} · {formatDate(item.createdAt)}</p></div></div>})}{!activities.length?<p className="text-sm text-[#9CA3AF]">No activity recorded yet.</p>:null}</div></section>

        {canConvert?<section className="rounded-2xl border border-[#F5B301]/30 bg-[#FFF9E8] p-5"><div className="flex items-center gap-3"><CircleDollarSign size={20} className="text-[#9A7000]"/><h2 className="font-serif text-xl font-bold">Investor handoff</h2></div>{lead.status==="converted"?<div className="mt-4 rounded-xl bg-white p-4"><p className="flex items-center gap-2 text-sm font-bold text-emerald-700"><CheckCircle2 size={16}/>Converted</p><p className="mt-2 break-all text-xs text-[#6B7280]">Handoff ID: {lead.conversionId||"Created"}</p><p className="mt-1 text-xs text-[#6B7280]">Status: {lead.conversionStatus||"pending ops profile creation"}</p></div>:<><p className="mt-3 text-sm leading-6 text-[#6B7280]">Create a controlled handoff request for the GrowVest Ops/Report Tool team. This does not silently create an investor login.</p><textarea rows={3} value={conversionNotes} onChange={(event)=>setConversionNotes(event.target.value)} className="mt-4 w-full rounded-xl border border-[#F5B301]/30 bg-white p-3 text-sm" placeholder="Conversion notes or onboarding context"/><button type="button" onClick={convertLead} disabled={busy==="convert"} className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0B0B0F] text-sm font-bold text-white disabled:opacity-60">{busy==="convert"?<LoaderCircle size={16} className="animate-spin"/>:<CheckCircle2 size={16}/>}Convert and create handoff</button></>}</section>:null}

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><h2 className="font-serif text-xl font-bold">System information</h2><div className="mt-4 space-y-4"><DetailItem label="Created">{formatDate(lead.createdAt)}</DetailItem><DetailItem label="Last updated">{formatDate(lead.updatedAt)}</DetailItem><DetailItem label="First contact">{formatDate(lead.firstContactAt)}</DetailItem><DetailItem label="Consent">{lead.consentAccepted?"Recorded":"Not recorded"}</DetailItem><DetailItem label="Database source"><code className="rounded bg-[#F4F6F9] px-2 py-1 text-xs">{lead.sourceCollection}/{lead.id}</code></DetailItem></div><button type="button" onClick={()=>navigator.clipboard?.writeText(lead.leadKey)} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#1F4ED8]"><Copy size={13}/>Copy lead key</button></section>
      </aside>
    </div>
  </div>;
}
