"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronRight, LoaderCircle, MessageSquareText, Search, X } from "lucide-react";

const STATUS_LABELS = {
  active: "Active",
  answered: "Answered",
  needs_follow_up: "Needs follow-up",
  handed_off: "WhatsApp handoff",
  closed: "Closed",
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function GuideConversationsManager({ initialItems = [], initialUnanswered = [] }) {
  const [items, setItems] = useState(initialItems);
  const [unanswered, setUnanswered] = useState(initialUnanswered);
  const [tab, setTab] = useState("conversations");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    const list = tab === "conversations" ? items : unanswered;
    if (!value) return list;
    return list.filter((item) => `${item.lastQuestion || item.question || ""} ${item.lastAnswer || ""} ${item.status || ""} ${item.pageUrl || ""}`.toLowerCase().includes(value));
  }, [items, unanswered, query, tab]);

  async function openConversation(item) {
    setSelected(item);
    setLoadingMessages(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/growvest-guide/conversations/${item.id}`, { cache: "no-store" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to load this conversation.");
      setMessages(result.messages || []);
    } catch (loadError) {
      setError(loadError?.message || "Unable to load this conversation.");
    } finally {
      setLoadingMessages(false);
    }
  }

  async function updateStatus(item, status) {
    setBusyId(item.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/growvest-guide/conversations/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalNote: item.internalNote || "" }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to update this conversation.");
      setItems((current) => current.map((entry) => entry.id === item.id ? result.item : entry));
      if (selected?.id === item.id) setSelected(result.item);
    } catch (updateError) {
      setError(updateError?.message || "Unable to update this conversation.");
    } finally {
      setBusyId("");
    }
  }

  async function resolveQuestion(item, status = "resolved") {
    setBusyId(item.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/growvest-guide/unanswered/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, resolutionNote: "Reviewed in GrowVest Guide Admin." }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to resolve this question.");
      setUnanswered((current) => current.filter((entry) => entry.id !== item.id));
    } catch (resolveError) {
      setError(resolveError?.message || "Unable to resolve this question.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div>
      <div className="mb-7"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Visitor Conversations</p><h1 className="mt-2 font-serif text-4xl font-bold">Questions and handoffs</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">Review Guide exchanges, identify unanswered questions and track visitors who continued to WhatsApp.</p></div>
      {error ? <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      <div className="rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-black/5 p-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex rounded-xl bg-[#F4F6F9] p-1"><button type="button" onClick={() => setTab("conversations")} className={`rounded-lg px-4 py-2 text-sm font-bold ${tab === "conversations" ? "bg-white text-[#1F4ED8] shadow-sm" : "text-[#6B7280]"}`}>Conversations ({items.length})</button><button type="button" onClick={() => setTab("unanswered")} className={`rounded-lg px-4 py-2 text-sm font-bold ${tab === "unanswered" ? "bg-white text-[#E53935] shadow-sm" : "text-[#6B7280]"}`}>Unanswered ({unanswered.length})</button></div><label className="relative"><Search size={15} className="absolute left-3 top-3 text-[#6B7280]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions" className="h-10 w-full rounded-xl border border-gray-200 pl-9 pr-3 text-sm lg:w-72" /></label></div>
        <div className="divide-y divide-black/5">
          {tab === "conversations" ? filtered.map((item) => <button key={item.id} type="button" onClick={() => openConversation(item)} className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-[#F9FAFB]"><div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#1F4ED8]/8 text-[#1F4ED8]"><MessageSquareText size={18} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="line-clamp-1 font-semibold">{item.lastQuestion || "Guide conversation"}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.status === "needs_follow_up" ? "bg-red-50 text-red-700" : item.status === "handed_off" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-[#1F4ED8]"}`}>{STATUS_LABELS[item.status] || item.status}</span></div><p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6B7280]">{item.lastAnswer || "No answer recorded."}</p><p className="mt-2 text-[11px] text-[#6B7280]">{formatDate(item.lastMessageAt)} · {item.pageUrl || "Unknown page"}</p></div><ChevronRight size={18} className="mt-2 flex-none text-[#6B7280]" /></button>) : filtered.map((item) => <div key={item.id} className="flex items-start gap-4 p-5"><div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-red-50 text-[#E53935]"><MessageSquareText size={18} /></div><div className="min-w-0 flex-1"><p className="font-semibold">{item.question}</p><p className="mt-2 text-xs text-[#6B7280]">Captured {formatDate(item.createdAt)} · {item.pageUrl || "Unknown page"}</p></div><div className="flex gap-2"><button type="button" onClick={() => resolveQuestion(item, "ignored")} disabled={busyId === item.id} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-[#6B7280] disabled:opacity-50">Ignore</button><button type="button" onClick={() => resolveQuestion(item)} disabled={busyId === item.id} className="inline-flex items-center gap-1.5 rounded-lg bg-[#1F4ED8] px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{busyId === item.id ? <LoaderCircle size={13} className="animate-spin" /> : <CheckCircle2 size={13} />} Resolved</button></div></div>)}
          {!filtered.length ? <div className="px-5 py-16 text-center"><MessageSquareText size={30} className="mx-auto text-[#6B7280]" /><h3 className="mt-4 font-serif text-2xl font-bold">Nothing to review here.</h3><p className="mt-2 text-sm text-[#6B7280]">New GrowVest Guide activity will appear automatically.</p></div> : null}
        </div>
      </div>

      {selected ? <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-5"><div className="max-h-[92dvh] w-full max-w-3xl overflow-hidden rounded-t-[24px] bg-white shadow-2xl sm:rounded-[24px]"><div className="flex items-start gap-4 border-b border-black/5 p-5"><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1F4ED8]">Guide conversation</p><h2 className="mt-1 line-clamp-2 font-serif text-2xl font-bold">{selected.lastQuestion || selected.id}</h2><p className="mt-1 text-xs text-[#6B7280]">{formatDate(selected.lastMessageAt)} · {selected.pageUrl || "Unknown page"}</p></div><button type="button" onClick={() => { setSelected(null); setMessages([]); }} className="rounded-xl p-2 text-[#6B7280] hover:bg-gray-100"><X size={19} /></button></div><div className="max-h-[58dvh] space-y-4 overflow-y-auto bg-[#F4F6F9] p-5">{loadingMessages ? <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#6B7280]"><LoaderCircle size={17} className="animate-spin" /> Loading conversation…</div> : messages.map((message) => <div key={message.id} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1F4ED8]">Visitor</p><p className="mt-1 text-sm leading-6">{message.userMessage}</p><div className="my-3 h-px bg-black/5" /><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">GrowVest Guide</p><p className="mt-1 text-sm leading-6 text-[#6B7280]">{message.assistantMessage}</p></div>)}{!loadingMessages && !messages.length ? <p className="py-16 text-center text-sm text-[#6B7280]">No messages were found.</p> : null}</div><div className="flex flex-col gap-3 border-t border-black/5 p-5 sm:flex-row sm:items-center sm:justify-between"><select value={selected.status || "active"} onChange={(event) => updateStatus(selected, event.target.value)} disabled={busyId === selected.id} className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold"><option value="active">Active</option><option value="answered">Answered</option><option value="needs_follow_up">Needs follow-up</option><option value="handed_off">WhatsApp handoff</option><option value="closed">Closed</option></select>{selected.leadKey ? <p className="text-xs font-semibold text-[#14863E]">Lead created: {selected.leadKey}</p> : <p className="text-xs text-[#6B7280]">No lead created from this conversation.</p>}</div></div></div> : null}
    </div>
  );
}
