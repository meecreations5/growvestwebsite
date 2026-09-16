"use client";

import { useState } from "react";
import { BarChart3, Download, LoaderCircle, RefreshCw, Target, Timer, TrendingUp } from "lucide-react";

function Bars({ title, items = [], maxItems = 10 }) {
  const shown = items.slice(0, maxItems);
  const max = Math.max(1, ...shown.map((item)=>item.value));
  return <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><h2 className="font-serif text-xl font-bold">{title}</h2><div className="mt-5 space-y-3">{shown.map((item)=><div key={item.label}><div className="mb-1.5 flex justify-between gap-3 text-xs"><span className="truncate">{item.label}</span><strong>{item.value}</strong></div><div className="h-2 overflow-hidden rounded-full bg-[#F4F6F9]"><div className="h-full rounded-full bg-[#1F4ED8]" style={{width:`${Math.max(3,Math.round((item.value/max)*100))}%`}}/></div></div>)}{!shown.length?<p className="text-sm text-[#9CA3AF]">No data in this range.</p>:null}</div></section>;
}

function ConversionTable({ title, items = [], maxItems = 10 }) {
  const shown = items.slice(0, maxItems);
  return <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><h2 className="font-serif text-xl font-bold">{title}</h2><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[420px] text-left text-xs"><thead className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]"><tr><th className="pb-3">Group</th><th className="pb-3 text-right">Leads</th><th className="pb-3 text-right">Converted</th><th className="pb-3 text-right">Rate</th></tr></thead><tbody className="divide-y divide-black/5">{shown.map((item)=><tr key={item.label}><td className="py-3 font-semibold">{item.label}</td><td className="py-3 text-right text-[#6B7280]">{item.total}</td><td className="py-3 text-right text-[#6B7280]">{item.converted}</td><td className="py-3 text-right font-bold text-[#1F4ED8]">{item.rate}%</td></tr>)}</tbody></table>{!shown.length?<p className="py-4 text-sm text-[#9CA3AF]">No conversion data in this range.</p>:null}</div></section>;
}

export function EnquiriesAnalyticsDashboard({ initialData }) {
  const [data, setData] = useState(initialData);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function refresh() {
    setBusy(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const response = await fetch(`/api/admin/enquiries/analytics?${params.toString()}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load analytics.");
      setData(result);
    } catch (refreshError) {
      setError(refreshError?.message || "Unable to load analytics.");
    } finally {
      setBusy(false);
    }
  }
  const summary = data.summary || {};
  const cards = [["Total enquiries",summary.total||0,BarChart3],["Overall conversion",`${summary.conversionRate||0}%`,TrendingUp],["Avg. first response",summary.averageFirstResponseHours==null?"Not available":`${summary.averageFirstResponseHours} hrs`,Timer],["Guide conversion",`${summary.guideConversionRate||0}%`,Target],["WhatsApp conversion",`${summary.whatsappConversionRate||0}%`,Target]];
  const exportParams = new URLSearchParams();
  if (from) exportParams.set("from", from);
  if (to) exportParams.set("to", to);
  const exportUrl = `/api/admin/enquiries/export${exportParams.toString() ? `?${exportParams.toString()}` : ""}`;
  return <div><div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Lead intelligence</p><h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Enquiry analytics</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B7280]">Review conversion, source, advisor, campaign and response-time performance.</p></div><a href={exportUrl} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-[#1F4ED8]"><Download size={16}/>Export CSV</a></div><div className="mb-5 grid gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:grid-cols-[1fr_1fr_auto]"><label className="text-sm font-semibold">From<input type="date" value={from} onChange={(event)=>setFrom(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal"/></label><label className="text-sm font-semibold">To<input type="date" value={to} onChange={(event)=>setTo(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-normal"/></label><button type="button" onClick={refresh} disabled={busy} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] px-5 text-sm font-bold text-white disabled:opacity-60">{busy?<LoaderCircle size={16} className="animate-spin"/>:<RefreshCw size={16}/>}Apply range</button></div>{error?<p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>:null}<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([label,value,Icon])=><div key={label} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F4ED8]/10 text-[#1F4ED8]"><Icon size={19}/></div><p className="mt-4 font-serif text-3xl font-bold">{value}</p><p className="mt-1 text-sm text-[#6B7280]">{label}</p></div>)}</div><div className="mt-6 grid gap-6 lg:grid-cols-2"><Bars title="Monthly enquiry trend" items={data.monthly}/><Bars title="Lead status funnel" items={data.statuses}/><Bars title="Enquiries by source" items={data.sources}/><Bars title="Leads by assigned team member" items={data.assignees}/><Bars title="Most selected goals" items={data.goals}/><Bars title="Top source pages" items={data.pages}/><Bars title="Campaign performance" items={data.campaigns}/><ConversionTable title="Conversion by source" items={data.sourceConversions}/><ConversionTable title="Conversion by team member" items={data.assigneeConversions}/></div></div>;
}
