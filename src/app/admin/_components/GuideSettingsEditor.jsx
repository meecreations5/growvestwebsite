"use client";

import { useState } from "react";
import { LoaderCircle, Save, ShieldCheck } from "lucide-react";

export function GuideSettingsEditor({ initialItem }) {
  const [form, setForm] = useState(initialItem);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/growvest-guide/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save Guide settings.");
      setForm(result.item);
      setNotice("GrowVest Guide settings saved.");
    } catch (saveError) {
      setError(saveError?.message || "Unable to save Guide settings.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save}>
      <div className="mb-7"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Configuration & Guardrails</p><h1 className="mt-2 font-serif text-4xl font-bold">GrowVest Guide settings</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">Control public language, quick questions, WhatsApp handoff and the educational boundary shown to visitors.</p></div>
      {(error || notice) ? <div className={`mb-5 rounded-xl px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{error || notice}</div> : null}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"><h2 className="font-serif text-2xl font-bold">Identity and welcome</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Assistant name"><input value={form.assistantName || ""} onChange={(event) => setForm((current) => ({ ...current, assistantName: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></Field><Field label="Launcher label"><input value={form.launcherLabel || ""} onChange={(event) => setForm((current) => ({ ...current, launcherLabel: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></Field><Field label="Welcome title" span><input value={form.welcomeTitle || ""} onChange={(event) => setForm((current) => ({ ...current, welcomeTitle: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></Field><Field label="Welcome message" span><textarea rows={4} value={form.welcomeMessage || ""} onChange={(event) => setForm((current) => ({ ...current, welcomeMessage: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-6" /></Field><Field label="Input placeholder" span><input value={form.inputPlaceholder || ""} onChange={(event) => setForm((current) => ({ ...current, inputPlaceholder: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></Field></div></section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"><h2 className="font-serif text-2xl font-bold">Approved fallback and boundary</h2><div className="mt-5 space-y-4"><Field label="No approved answer"><textarea rows={4} value={form.fallbackMessage || ""} onChange={(event) => setForm((current) => ({ ...current, fallbackMessage: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-6" /></Field><Field label="Personalised-advice boundary"><textarea rows={5} value={form.adviceBoundaryMessage || ""} onChange={(event) => setForm((current) => ({ ...current, adviceBoundaryMessage: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-6" /></Field><Field label="Public disclaimer"><textarea rows={4} value={form.disclaimer || ""} onChange={(event) => setForm((current) => ({ ...current, disclaimer: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-6" /></Field></div></section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"><h2 className="font-serif text-2xl font-bold">Quick prompts</h2><p className="mt-1 text-sm text-[#6B7280]">One question per line, maximum eight.</p><textarea rows={8} value={(form.quickPrompts || []).join("\n")} onChange={(event) => setForm((current) => ({ ...current, quickPrompts: event.target.value.split("\n").map((value) => value.trim()).filter(Boolean).slice(0, 8) }))} className="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-6" /></section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><h2 className="font-serif text-xl font-bold">Availability</h2><div className="mt-4 space-y-4"><label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold"><span>Enable public Guide</span><input type="checkbox" checked={form.isEnabled !== false} onChange={(event) => setForm((current) => ({ ...current, isEnabled: event.target.checked }))} className="h-4 w-4 accent-[#1F4ED8]" /></label><label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold"><span>Enable guided journeys</span><input type="checkbox" checked={form.guidedJourneysEnabled !== false} onChange={(event) => setForm((current) => ({ ...current, guidedJourneysEnabled: event.target.checked }))} className="h-4 w-4 accent-[#1F4ED8]" /></label><label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold"><span>Remember current session</span><input type="checkbox" checked={form.sessionMemoryEnabled !== false} onChange={(event) => setForm((current) => ({ ...current, sessionMemoryEnabled: event.target.checked }))} className="h-4 w-4 accent-[#1F4ED8]" /></label><label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold"><span>Show answer feedback</span><input type="checkbox" checked={form.feedbackEnabled !== false} onChange={(event) => setForm((current) => ({ ...current, feedbackEnabled: event.target.checked }))} className="h-4 w-4 accent-[#1F4ED8]" /></label><label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold"><span>Show approved sources</span><input type="checkbox" checked={form.showSources !== false} onChange={(event) => setForm((current) => ({ ...current, showSources: event.target.checked }))} className="h-4 w-4 accent-[#1F4ED8]" /></label><label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold"><span>Enable WhatsApp handoff</span><input type="checkbox" checked={form.whatsappEnabled !== false} onChange={(event) => setForm((current) => ({ ...current, whatsappEnabled: event.target.checked }))} className="h-4 w-4 accent-[#1F4ED8]" /></label><Field label="WhatsApp number"><input value={form.whatsappNumber || ""} onChange={(event) => setForm((current) => ({ ...current, whatsappNumber: event.target.value }))} inputMode="tel" className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" placeholder="918655768940" /></Field><Field label="WhatsApp button label"><input value={form.whatsappLabel || ""} onChange={(event) => setForm((current) => ({ ...current, whatsappLabel: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></Field><Field label="Low-confidence threshold"><input type="number" min="0.1" max="0.9" step="0.05" value={form.lowConfidenceThreshold ?? 0.35} onChange={(event) => setForm((current) => ({ ...current, lowConfidenceThreshold: Number(event.target.value) }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></Field><Field label="Session memory (hours)"><input type="number" min="1" max="168" value={form.sessionRetentionHours || 24} onChange={(event) => setForm((current) => ({ ...current, sessionRetentionHours: Number(event.target.value) }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></Field><Field label="Maximum source links"><input type="number" min="1" max="5" value={form.maxAnswerSources || 3} onChange={(event) => setForm((current) => ({ ...current, maxAnswerSources: Number(event.target.value) }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></Field></div></section>
          <section className="rounded-2xl border border-[#F5B301]/25 bg-[#FFF9E8] p-5"><div className="flex gap-3"><ShieldCheck size={22} className="mt-0.5 flex-none text-[#9A7000]" /><div><h3 className="font-bold">Educational guardrail</h3><p className="mt-2 text-sm leading-6 text-[#6B7280]">The Guide searches only published GrowVest answers, FAQs, goals and Insights. Guided journeys collect only goal context, never recommend a specific product, and require consent before WhatsApp handoff.</p></div></div></section>
          <button type="submit" disabled={busy} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white shadow-lg disabled:opacity-60">{busy ? <LoaderCircle size={17} className="animate-spin" /> : <Save size={17} />} Save Guide settings</button>
        </aside>
      </div>
    </form>
  );
}

function Field({ label, children, span = false }) {
  return <div className={span ? "sm:col-span-2" : ""}><label className="mb-2 block text-sm font-semibold">{label}</label>{children}</div>;
}
