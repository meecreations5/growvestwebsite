"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, CircleDollarSign, Clock3, Copy, ExternalLink, FileText, History, LoaderCircle, Mail, MessageCircle, Phone, Save, Send, ShieldAlert, Target, UserCheck, UserRound, Users } from "lucide-react";
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
  if (action.includes("conversion") || action.includes("converted")) return CheckCircle2;
  if (action.includes("created")) return UserRound;
  return History;
}

function renderTemplate(value, variables) {
  return String(value || "").replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => String(variables[key] ?? ""));
}

export function EnquiryDetail({ initialData, assignees = [], permissions = [] }) {
  const [lead, setLead] = useState(initialData.lead);
  const [notes, setNotes] = useState(initialData.notes || []);
  const [activities, setActivities] = useState(initialData.activities || []);
  const [communications, setCommunications] = useState(initialData.communications || []);
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({
    status: initialData.lead.status || "new",
    priority: initialData.lead.priority || "normal",
    assignedTo: initialData.lead.assignedTo || "",
    followUpAt: toLocalInput(initialData.lead.followUpAt),
    nextAction: initialData.lead.nextAction || "",
    lostReason: initialData.lead.lostReason || "",
    tags: (initialData.lead.tags || []).join(", "),
    consentAccepted: initialData.lead.consentAccepted === true,
  });
  const [note, setNote] = useState("");
  const [emailForm, setEmailForm] = useState({ subject: "Your GrowVest enquiry", message: "Thank you for connecting with GrowVest. We would like to understand your goals and priorities better. Please share a suitable time for a short conversation.", templateKey: "" });
  const [whatsappForm, setWhatsappForm] = useState({ message: `Hello ${initialData.lead.fullName || "there"}, thank you for connecting with GrowVest. Please share a convenient time for a short conversation.`, templateKey: "" });
  const [conversionForm, setConversionForm] = useState({ notes: "", preferredCommunicationMethod: "whatsapp", duplicateReviewCompleted: false, selectedInvestorReference: "" });
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canManage = permissions.includes("enquiries.manage");
  const canAssign = permissions.includes("enquiries.assign");
  const canCommunicate = permissions.includes("enquiries.communicate");
  const canConvert = permissions.includes("enquiries.convert");
  const canReadTemplates = permissions.includes("communicationTemplates.read");
  const selectedAssignee = useMemo(() => assignees.find((item) => item.uid === form.assignedTo), [assignees, form.assignedTo]);
  const leadPath = `/api/admin/enquiries/${encodeURIComponent(lead.leadKey)}`;
  const investorMatches = initialData.investorMatches || [];
  const duplicates = initialData.duplicates || [];

  useEffect(() => {
    if (!canReadTemplates) return;
    fetch("/api/admin/communication-templates?status=approved", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : { items: [] })
      .then((result) => setTemplates((result.items || []).filter((item) => item.status === "approved" && item.isEnabled !== false)))
      .catch(() => setTemplates([]));
  }, [canReadTemplates]);

  function showMessage(kind, text) {
    if (kind === "error") { setError(text); setSuccess(""); }
    else { setSuccess(text); setError(""); }
  }

  function templateVariables() {
    return {
      leadName: lead.fullName || "there",
      advisorName: selectedAssignee?.displayName || lead.assignedToName || "GrowVest Team",
      goal: lead.serviceArea || lead.goals?.[0]?.title || "your financial goals",
      message: "",
      followUpDate: form.followUpAt ? formatDate(form.followUpAt) : "",
      leadReference: lead.requestId || lead.leadKey,
    };
  }

  function applyEmailTemplate(key) {
    const template = templates.find((item) => item.key === key && item.channel === "email");
    if (!template) return;
    const variables = templateVariables();
    setEmailForm({ templateKey: key, subject: renderTemplate(template.subject, variables), message: renderTemplate(template.body, variables) });
  }

  function applyWhatsappTemplate(key) {
    const template = templates.find((item) => item.key === key && item.channel === "whatsapp");
    if (!template) return;
    setWhatsappForm({ templateKey: key, message: renderTemplate(template.body, templateVariables()) });
  }

  async function saveLead(event) {
    event.preventDefault();
    setBusy("save");
    showMessage("success", "");
    try {
      const payload = {};
      if (canManage) {
        Object.assign(payload, {
          status: form.status,
          priority: form.priority,
          followUpAt: form.followUpAt ? new Date(form.followUpAt).toISOString() : "",
          nextAction: form.nextAction,
          lostReason: form.lostReason,
          tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
          consentAccepted: form.consentAccepted === true,
        });
      }
      if (canAssign) payload.assignedTo = form.assignedTo;
      const response = await fetch(leadPath, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save this enquiry.");
      setLead(result.item);
      showMessage("success", "Enquiry details updated.");
      setActivities((current) => [{ id: `local-${Date.now()}`, action: "lead.updated", summary: "Updated enquiry details.", actorName: "Current admin", createdAt: new Date().toISOString() }, ...current]);
    } catch (saveError) {
      showMessage("error", saveError?.message || "Unable to save this enquiry.");
    } finally {
      setBusy("");
    }
  }

  async function addNote(event) {
    event.preventDefault();
    setBusy("note");
    try {
      const response = await fetch(`${leadPath}/notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note, visibility: "team" }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save this note.");
      setNotes((current) => [result.note, ...current]);
      setNote("");
      showMessage("success", "Internal note added.");
    } catch (noteError) {
      showMessage("error", noteError?.message || "Unable to save this note.");
    } finally {
      setBusy("");
    }
  }

  async function sendEmail(event) {
    event.preventDefault();
    setBusy("email");
    try {
      const response = await fetch(`${leadPath}/communications/email`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(emailForm) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to send this email.");
      setCommunications((current) => [{ id: `local-${Date.now()}`, channel: "email", type: "admin_lead_follow_up", recipient: lead.email, subject: emailForm.subject, status: "sent", createdAt: new Date().toISOString() }, ...current]);
      if (["new", "new_email_attention_required"].includes(lead.status)) {
        setLead((current) => ({ ...current, status: "contact_attempted" }));
        setForm((current) => ({ ...current, status: "contact_attempted" }));
      }
      showMessage("success", "Email sent and added to communication history.");
    } catch (emailError) {
      showMessage("error", emailError?.message || "Unable to send this email.");
    } finally {
      setBusy("");
    }
  }

  async function openWhatsapp(event) {
    event.preventDefault();
    setBusy("whatsapp");
    try {
      const response = await fetch(`${leadPath}/communications/whatsapp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(whatsappForm) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to prepare WhatsApp.");
      setCommunications((current) => [{ id: `local-${Date.now()}`, channel: "whatsapp", type: "admin_whatsapp_handoff", recipient: lead.phone, status: "prepared", createdAt: new Date().toISOString() }, ...current]);
      window.open(result.url, "_blank", "noopener,noreferrer");
      showMessage("success", "WhatsApp opened and the handoff was logged.");
    } catch (whatsappError) {
      showMessage("error", whatsappError?.message || "Unable to prepare WhatsApp.");
    } finally {
      setBusy("");
    }
  }

  async function requestConversion() {
    setBusy("convert");
    try {
      const response = await fetch(`${leadPath}/convert`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(conversionForm) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to create the conversion request.");
      setLead(result.lead || lead);
      showMessage("success", `Conversion request created: ${result.conversionId}`);
    } catch (convertError) {
      showMessage("error", convertError?.message || "Unable to create the conversion request.");
    } finally {
      setBusy("");
    }
  }

  const eligibility = [
    [lead.status === "qualified", "Lead status is Qualified"],
    [Boolean(lead.assignedTo || form.assignedTo), "GrowVest team member assigned"],
    [Boolean(lead.email || lead.phoneNormalized), "Valid email or mobile available"],
    [lead.consentAccepted === true, "Contact consent recorded"],
    [conversionForm.duplicateReviewCompleted, "Duplicate and investor review completed"],
    [Boolean(conversionForm.notes.trim()), "Conversion notes entered"],
    [Boolean(conversionForm.preferredCommunicationMethod), "Preferred communication method recorded"],
  ];
  const canRequestConversion = eligibility.every(([value]) => value) && !lead.conversionId;

  return <div>
    <Link href="/admin/enquiries" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#1F4ED8]"><ArrowLeft size={16}/>Back to enquiries</Link>
    <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><LeadStatusBadge status={lead.status}/><PriorityBadge priority={lead.priority}/><span className="rounded-full bg-[#F4F6F9] px-2.5 py-1 text-[10px] font-bold text-[#6B7280]">{lead.sourceLabel}</span></div><h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">{lead.fullName}</h1><p className="mt-2 text-sm text-[#6B7280]">Reference {lead.requestId} · Received {formatDate(lead.createdAt)}</p></div><div className="flex flex-wrap gap-2">{lead.email?<a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-[#1F4ED8]"><Mail size={16}/>{lead.email}</a>:null}{lead.phone?<a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-[#1F4ED8]"><Phone size={16}/>{lead.phone}</a>:null}</div></div>
    {error?<p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>:null}{success?<p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>:null}

    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><Target size={20} className="text-[#1F4ED8]"/><h2 className="font-serif text-2xl font-bold">Enquiry context</h2></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><DetailItem label="Area of interest">{lead.serviceArea?.replaceAll("_"," ")}</DetailItem><DetailItem label="Preferred slot">{lead.preferredSlot}</DetailItem><DetailItem label="Source page">{lead.sourcePage}</DetailItem><DetailItem label="Campaign">{lead.campaign?.campaign || lead.campaign?.source || "Organic / direct"}</DetailItem></div>{lead.message?<div className="mt-5 rounded-xl bg-[#F4F6F9] p-4"><p className="whitespace-pre-wrap text-sm leading-6 text-[#4B5563]">{lead.message}</p></div>:null}{lead.goals?.length?<div className="mt-5 grid gap-3 sm:grid-cols-2">{lead.goals.map((goal,index)=><div key={`${goal.title||goal.name||index}`} className="rounded-xl border border-gray-100 p-4"><p className="font-semibold">{goal.title||goal.name||"Selected goal"}</p>{goal.targetValue?<p className="mt-1 text-sm text-[#6B7280]">Target {formatMoney(goal.targetValue)}</p>:null}</div>)}</div>:null}</section>

        {(duplicates.length || investorMatches.length)?<section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6"><div className="flex items-center gap-3"><ShieldAlert size={20} className="text-amber-700"/><h2 className="font-serif text-2xl font-bold">Identity and duplicate review</h2></div>{investorMatches.length?<div className="mt-5"><h3 className="text-sm font-bold text-amber-900">Existing investor matches</h3><div className="mt-3 space-y-2">{investorMatches.map((item)=><div key={item.reference} className="rounded-xl bg-white p-4"><p className="font-semibold">{item.displayName}</p><p className="mt-1 text-xs text-[#6B7280]">{item.reference} · {item.email||item.phone||"Contact hidden"}</p></div>)}</div></div>:null}{duplicates.length?<div className="mt-5"><h3 className="text-sm font-bold text-amber-900">Previous enquiries</h3><div className="mt-3 space-y-2">{duplicates.map((item)=><Link key={item.leadKey} href={`/admin/enquiries/${encodeURIComponent(item.leadKey)}`} className="flex items-center justify-between rounded-xl bg-white p-4"><div><p className="font-semibold">{item.fullName}</p><p className="mt-1 text-xs text-[#6B7280]">{item.sourceLabel} · {item.status}</p></div><ExternalLink size={15} className="text-[#1F4ED8]"/></Link>)}</div></div>:null}</section>:null}

        {canManage?<section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-2xl font-bold">Internal notes</h2><form onSubmit={addNote} className="mt-4"><textarea required rows={4} value={note} onChange={(event)=>setNote(event.target.value)} className="w-full rounded-xl border border-gray-200 p-3 text-sm" placeholder="Add a factual internal note for the GrowVest team."/><button disabled={busy==="note"} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#0B0B0F] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{busy==="note"?<LoaderCircle size={16} className="animate-spin"/>:<FileText size={16}/>}Add note</button></form><div className="mt-5 space-y-3">{notes.map((item)=><div key={item.id} className="rounded-xl bg-[#F4F6F9] p-4"><p className="whitespace-pre-wrap text-sm leading-6 text-[#4B5563]">{item.note}</p><p className="mt-2 text-[10px] font-semibold text-[#9CA3AF]">{item.createdByName||"GrowVest Team"} · {formatDate(item.createdAt)}</p></div>)}{!notes.length?<p className="text-sm text-[#9CA3AF]">No internal notes yet.</p>:null}</div></section>:null}

        {canCommunicate?<section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-2xl font-bold">Communication centre</h2>{canReadTemplates?<Link href="/admin/communication-templates" className="text-xs font-bold text-[#1F4ED8]">Manage templates →</Link>:null}</div><div className="mt-5 grid gap-5 lg:grid-cols-2"><form onSubmit={sendEmail} className="rounded-2xl border border-gray-100 p-4"><div className="flex items-center gap-2 font-bold"><Mail size={17} className="text-[#1F4ED8]"/>Send email</div>{templates.some((item)=>item.channel==="email")?<select value={emailForm.templateKey} onChange={(event)=>applyEmailTemplate(event.target.value)} className="mt-4 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm"><option value="">Choose approved template</option>{templates.filter((item)=>item.channel==="email").map((item)=><option key={item.id} value={item.key}>{item.name}</option>)}</select>:null}<input disabled={!lead.email} value={emailForm.subject} onChange={(event)=>setEmailForm({...emailForm,subject:event.target.value})} className="mt-3 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" placeholder="Subject"/><textarea disabled={!lead.email} rows={7} value={emailForm.message} onChange={(event)=>setEmailForm({...emailForm,message:event.target.value})} className="mt-3 w-full rounded-xl border border-gray-200 p-3 text-sm"/><button disabled={!lead.email||busy==="email"} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{busy==="email"?<LoaderCircle size={16} className="animate-spin"/>:<Send size={16}/>}Send through Brevo</button></form><form onSubmit={openWhatsapp} className="rounded-2xl border border-gray-100 p-4"><div className="flex items-center gap-2 font-bold"><MessageCircle size={17} className="text-emerald-600"/>Open WhatsApp</div>{templates.some((item)=>item.channel==="whatsapp")?<select value={whatsappForm.templateKey} onChange={(event)=>applyWhatsappTemplate(event.target.value)} className="mt-4 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm"><option value="">Choose approved template</option>{templates.filter((item)=>item.channel==="whatsapp").map((item)=><option key={item.id} value={item.key}>{item.name}</option>)}</select>:null}<textarea disabled={!lead.phone} rows={9} value={whatsappForm.message} onChange={(event)=>setWhatsappForm({...whatsappForm,message:event.target.value})} className="mt-3 w-full rounded-xl border border-gray-200 p-3 text-sm"/><button disabled={!lead.phone||busy==="whatsapp"} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{busy==="whatsapp"?<LoaderCircle size={16} className="animate-spin"/>:<ExternalLink size={16}/>}Log and open WhatsApp</button></form></div><div className="mt-6"><h3 className="text-sm font-bold">Communication history</h3><div className="mt-3 space-y-2">{communications.map((item)=><div key={item.id} className="flex items-start gap-3 rounded-xl bg-[#F4F6F9] p-3"><div className="mt-0.5">{item.channel==="whatsapp"?<MessageCircle size={15} className="text-emerald-600"/>:<Mail size={15} className="text-[#1F4ED8]"/>}</div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.subject||item.type?.replaceAll("_"," ")||item.channel}</p><p className="mt-1 truncate text-xs text-[#6B7280]">To {item.recipient} · {item.status}</p>{item.deliveredAt?<p className="mt-1 text-[10px] text-emerald-700">Delivered {formatDate(item.deliveredAt)}</p>:null}</div><span className="text-[10px] text-[#9CA3AF]">{formatDate(item.createdAt)}</span></div>)}{!communications.length?<p className="text-sm text-[#9CA3AF]">No communication history yet.</p>:null}</div></div></section>:null}
      </div>

      <aside className="space-y-6">
        {(canManage||canAssign)?<form onSubmit={saveLead} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><UserCheck size={19} className="text-[#1F4ED8]"/><h2 className="font-serif text-xl font-bold">Lead management</h2></div><div className="mt-5 space-y-4"><label className="block text-sm font-semibold">Status<select disabled={!canManage} value={form.status} onChange={(event)=>setForm({...form,status:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 font-normal disabled:bg-gray-50">{STATUS_OPTIONS.map((status)=><option key={status} value={status}>{leadStatusLabel(status)}</option>)}</select></label><label className="block text-sm font-semibold">Priority<select disabled={!canManage} value={form.priority} onChange={(event)=>setForm({...form,priority:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 font-normal disabled:bg-gray-50">{PRIORITY_OPTIONS.map((priority)=><option key={priority} value={priority}>{priority[0].toUpperCase()+priority.slice(1)}</option>)}</select></label><label className="block text-sm font-semibold">Assigned team member<select disabled={!canAssign} value={form.assignedTo} onChange={(event)=>setForm({...form,assignedTo:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 font-normal disabled:bg-gray-50"><option value="">Unassigned</option>{assignees.map((item)=><option key={item.uid} value={item.uid}>{item.displayName}</option>)}</select></label><label className="block text-sm font-semibold">Follow-up date and time<input disabled={!canManage} type="datetime-local" value={form.followUpAt} onChange={(event)=>setForm({...form,followUpAt:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal disabled:bg-gray-50"/></label><label className="block text-sm font-semibold">Next action<textarea disabled={!canManage} rows={3} value={form.nextAction} onChange={(event)=>setForm({...form,nextAction:event.target.value})} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal disabled:bg-gray-50"/></label><label className="block text-sm font-semibold">Tags<input disabled={!canManage} value={form.tags} onChange={(event)=>setForm({...form,tags:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal disabled:bg-gray-50"/></label><label className="flex items-start gap-3 rounded-xl bg-[#F4F6F9] p-3 text-xs font-semibold leading-5 text-[#4B5563]"><input disabled={!canManage} type="checkbox" checked={form.consentAccepted} onChange={(event)=>setForm({...form,consentAccepted:event.target.checked})} className="mt-0.5 h-4 w-4 accent-[#1F4ED8] disabled:opacity-50"/><span>Contact consent has been recorded and can be evidenced.</span></label>{["closed","not_interested","invalid","spam"].includes(form.status)?<label className="block text-sm font-semibold">Closure reason<textarea disabled={!canManage} rows={3} value={form.lostReason} onChange={(event)=>setForm({...form,lostReason:event.target.value})} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal disabled:bg-gray-50"/></label>:null}<button disabled={busy==="save"} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white disabled:opacity-60">{busy==="save"?<LoaderCircle size={16} className="animate-spin"/>:<Save size={16}/>}Save lead</button></div></form>:null}

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><Clock3 size={18} className="text-[#1F4ED8]"/><h2 className="font-serif text-xl font-bold">Timeline</h2></div><div className="mt-5 space-y-4">{activities.map((item)=>{const Icon=activityIcon(item.action);return <div key={item.id} className="flex gap-3"><div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#F4F6F9] text-[#1F4ED8]"><Icon size={14}/></div><div><p className="text-sm font-semibold leading-5">{item.summary||item.action?.replaceAll("_"," ")}</p><p className="mt-1 text-[10px] text-[#9CA3AF]">{item.actorName||"System"} · {formatDate(item.createdAt)}</p></div></div>})}{!activities.length?<p className="text-sm text-[#9CA3AF]">No activity recorded yet.</p>:null}</div></section>

        {canConvert?<section className="rounded-2xl border border-[#F5B301]/30 bg-[#FFF9E8] p-5"><div className="flex items-center gap-3"><CircleDollarSign size={20} className="text-[#9A7000]"/><h2 className="font-serif text-xl font-bold">Investor conversion</h2></div>{lead.conversionId?<div className="mt-4 rounded-xl bg-white p-4"><p className="flex items-center gap-2 text-sm font-bold text-[#1F4ED8]"><CheckCircle2 size={16}/>Conversion request created</p><p className="mt-2 break-all text-xs text-[#6B7280]">Request: {lead.conversionId}</p><p className="mt-1 text-xs text-[#6B7280]">Status: {lead.conversionStatus||"pending review"}</p><Link href={`/admin/enquiries/conversions/${lead.conversionId}`} className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#1F4ED8]">Open conversion review <ExternalLink size={13}/></Link></div>:<><p className="mt-3 text-sm leading-6 text-[#6B7280]">A conversion request is reviewed before an Investor profile is created or linked.</p><div className="mt-4 space-y-2">{eligibility.map(([value,label])=><div key={label} className={`flex items-start gap-2 text-xs ${value?"text-emerald-700":"text-red-700"}`}>{value?<CheckCircle2 size={14}/>:<AlertTriangle size={14}/>}<span>{label}</span></div>)}</div><label className="mt-4 block text-sm font-semibold">Preferred communication<select value={conversionForm.preferredCommunicationMethod} onChange={(event)=>setConversionForm({...conversionForm,preferredCommunicationMethod:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-[#F5B301]/30 bg-white px-3 font-normal"><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="phone">Phone</option><option value="video_call">Video call</option></select></label><label className="mt-4 block text-sm font-semibold">Conversion notes<textarea rows={4} value={conversionForm.notes} onChange={(event)=>setConversionForm({...conversionForm,notes:event.target.value})} className="mt-2 w-full rounded-xl border border-[#F5B301]/30 bg-white p-3 font-normal"/></label>{investorMatches.length?<label className="mt-4 block text-sm font-semibold">Possible existing investor<select value={conversionForm.selectedInvestorReference} onChange={(event)=>setConversionForm({...conversionForm,selectedInvestorReference:event.target.value})} className="mt-2 h-11 w-full rounded-xl border border-[#F5B301]/30 bg-white px-3 font-normal"><option value="">No confirmed match / create new</option>{investorMatches.map((item)=><option key={item.reference} value={item.reference}>{item.displayName} · {item.reference}</option>)}</select></label>:null}<label className="mt-4 flex items-start gap-3 rounded-xl bg-white p-3 text-xs leading-5 text-[#6B7280]"><input type="checkbox" checked={conversionForm.duplicateReviewCompleted} onChange={(event)=>setConversionForm({...conversionForm,duplicateReviewCompleted:event.target.checked})} className="mt-0.5 h-4 w-4 accent-[#1F4ED8]"/>I reviewed previous enquiries and existing-investor matches.</label><button type="button" onClick={requestConversion} disabled={busy==="convert"||!canRequestConversion} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0B0B0F] text-sm font-bold text-white disabled:opacity-40">{busy==="convert"?<LoaderCircle size={16} className="animate-spin"/>:<CheckCircle2 size={16}/>}Create conversion request</button></>}</section>:null}

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><h2 className="font-serif text-xl font-bold">System information</h2><div className="mt-4 space-y-4"><DetailItem label="Created">{formatDate(lead.createdAt)}</DetailItem><DetailItem label="Last updated">{formatDate(lead.updatedAt)}</DetailItem><DetailItem label="First contact">{formatDate(lead.firstContactAt)}</DetailItem><DetailItem label="Consent">{lead.consentAccepted?"Recorded":"Not recorded"}</DetailItem><DetailItem label="Database source"><code className="rounded bg-[#F4F6F9] px-2 py-1 text-xs">{lead.sourceCollection}/{lead.id}</code></DetailItem></div><button type="button" onClick={()=>navigator.clipboard?.writeText(lead.leadKey)} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#1F4ED8]"><Copy size={13}/>Copy lead key</button></section>
      </aside>
    </div>
  </div>;
}
