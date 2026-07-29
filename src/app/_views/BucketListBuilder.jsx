"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, ArrowRight, GraduationCap, Home as HomeIcon, Star, Shield, Plane, TrendingUp, Heart, Globe, Target, Check, Mail } from "lucide-react";
import { BLUE, BLACK, GOLD, GRAY, MGRAY, serif, dotGrid } from "../lib/brand";
import { trackEvent } from "../lib/analytics";
const GOAL_OPTIONS = [
    { id: "child-education", Icon: GraduationCap, label: "Child Education", color: "#8B5CF6", defaultCorpus: 4000000, defaultYears: 12 },
    { id: "dream-home", Icon: HomeIcon, label: "Dream Home", color: BLUE, defaultCorpus: 3000000, defaultYears: 6 },
    { id: "retirement", Icon: Star, label: "Retirement", color: "#10B981", defaultCorpus: 30000000, defaultYears: 20 },
    { id: "emergency-reserve", Icon: Shield, label: "Emergency Reserve", color: "#E53935", defaultCorpus: 1200000, defaultYears: 3 },
    { id: "travel-sabbatical", Icon: Plane, label: "Travel / Sabbatical", color: "#EC4899", defaultCorpus: 1500000, defaultYears: 4 },
    { id: "wealth-legacy", Icon: TrendingUp, label: "Wealth & Legacy", color: GOLD, defaultCorpus: 10000000, defaultYears: 25 },
    { id: "health-corpus", Icon: Heart, label: "Health Corpus", color: "#F97316", defaultCorpus: 2000000, defaultYears: 10 },
    { id: "nri-global-goal", Icon: Globe, label: "NRI / Global Goal", color: "#14B8A6", defaultCorpus: 5000000, defaultYears: 8 },
];
function calcSIP(corpus, years, rate = 0.12) {
    if (years <= 0 || corpus <= 0)
        return 0;
    const n = years * 12;
    const r = rate / 12;
    return Math.round(corpus * r / (Math.pow(1 + r, n) - 1));
}
function fmt(n) {
    if (n >= 10000000)
        return `₹${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000)
        return `₹${(n / 100000).toFixed(1)}L`;
    return `₹${n.toLocaleString("en-IN")}`;
}
let nextId = 1;
function buildGoal(option, rate) {
    return {
        id: nextId++,
        goalId: option.id,
        type: option.label,
        label: option.label,
        color: option.color,
        Icon: option.Icon,
        corpus: option.defaultCorpus,
        years: option.defaultYears,
        monthly: calcSIP(option.defaultCorpus, option.defaultYears, rate),
    };
}
export default function BucketListBuilder() {
    const [goals, setGoals] = useState([]);
    const [adding, setAdding] = useState(false);
    const [selectedType, setSelectedType] = useState(0);
    const [assumedRate, setAssumedRate] = useState(0.10);
    const preloadedRef = useRef(false);
    const [summaryOpen, setSummaryOpen] = useState(false);
    const [summaryStatus, setSummaryStatus] = useState("idle");
    const [summaryError, setSummaryError] = useState("");
    const [summaryRequestId, setSummaryRequestId] = useState("");
    const [summaryForm, setSummaryForm] = useState({
        name: "",
        email: "",
        phone: "",
        consent: false,
        website: "",
    });
    const totalSIP = goals.reduce((s, g) => s + g.monthly, 0);
    const totalCorpus = goals.reduce((s, g) => s + g.corpus, 0);

    useEffect(() => {
        if (preloadedRef.current) return;
        preloadedRef.current = true;
        const parameters = new URLSearchParams(window.location.search);
        const requested = (parameters.get("goals") || "").split(",").map((value) => value.trim()).filter(Boolean);
        const options = requested.map((id) => GOAL_OPTIONS.find((option) => option.id === id)).filter(Boolean);

        if (options.length) {
            setGoals(options.slice(0, 3).map((option) => buildGoal(option, 0.10)));
            trackEvent("bucket_builder_preloaded", { selected_goal_count: Math.min(options.length, 3) });
        }
    }, []);

    function addGoal() {
        const opt = GOAL_OPTIONS[selectedType];
        setGoals(prev => [...prev, buildGoal(opt, assumedRate)]);
        trackEvent("bucket_builder_goal_added", { goal_id: opt.id, goal_count: goals.length + 1 });
        setAdding(false);
    }
    function updateGoal(id, field, val) {
        setGoals(prev => prev.map(g => {
            if (g.id !== id)
                return g;
            const updated = { ...g, [field]: val };
            updated.monthly = calcSIP(updated.corpus, updated.years, assumedRate);
            return updated;
        }));
    }
    function changeRate(value) {
        const rate = Number(value);
        setAssumedRate(rate);
        setGoals(prev => prev.map(g => ({ ...g, monthly: calcSIP(g.corpus, g.years, rate) })));
        trackEvent("bucket_builder_rate_changed", { assumed_rate: rate });
    }
    function removeGoal(id) {
        const goal = goals.find((item) => item.id === id);
        setGoals(prev => prev.filter(g => g.id !== id));
        trackEvent("bucket_builder_goal_removed", { goal_id: goal?.goalId || "unknown", goal_count: Math.max(0, goals.length - 1) });
    }

    function handleSummaryChange(event) {
        const { name, value, type, checked } = event.target;
        setSummaryForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    }

    async function handleSummarySubmit(event) {
        event.preventDefault();
        setSummaryStatus("submitting");
        setSummaryError("");

        try {
            const response = await fetch("/api/bucket-list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...summaryForm,
                    assumedRate,
                    goals: goals.map(({ goalId, label, corpus, years, monthly }) => ({ goalId, label, corpus, years, monthly })),
                    sourcePage: window.location.pathname,
                    campaign: {
                        source: new URLSearchParams(window.location.search).get("utm_source") || "",
                        medium: new URLSearchParams(window.location.search).get("utm_medium") || "",
                        campaign: new URLSearchParams(window.location.search).get("utm_campaign") || "",
                        term: new URLSearchParams(window.location.search).get("utm_term") || "",
                        content: new URLSearchParams(window.location.search).get("utm_content") || "",
                    },
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "We could not send your summary.");

            setSummaryStatus("success");
            setSummaryRequestId(data.requestId || "");
            trackEvent("bucket_builder_summary_requested", { goal_count: goals.length, summary_sent: Boolean(data.summarySent) });
        } catch (error) {
            setSummaryStatus("error");
            setSummaryError(error.message || "We could not send your summary. Please try again later.");
            trackEvent("bucket_builder_summary_error", { goal_count: goals.length });
        }
    }
    return (<>
      {/* Hero */}
      <section className="relative py-24 lg:py-36 overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 55% 55% at 50% 40%, rgba(31,78,216,0.14) 0%, transparent 65%)` }}/>
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 lg:px-8 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-8" style={{ background: GOLD }}/>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>Bucket List Builder</span>
            <div className="h-px w-8" style={{ background: GOLD }}/>
          </div>
          <h1 className="text-[52px] xl:text-[72px] font-bold text-white mb-6 leading-[1.04]" style={serif}>
            Build Your<br />
            <em style={{ color: GOLD, fontStyle: "italic" }}>Bucket List Plan.</em>
          </h1>
          <p className="text-white/45 text-[17px] leading-relaxed max-w-[540px] mx-auto">
            Add your life goals, select a target amount and timeline, and view an illustrative monthly investment estimate based on the assumptions you choose.
          </p>
        </div>
      </section>

      {/* Builder */}
      <section className="py-16 lg:py-24 bg-[#F4F6F9]">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">

            {/* Goals list */}
            <div className="space-y-4">
              {goals.length === 0 && (<div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                  <Target size={32} className="mx-auto mb-4 text-gray-300"/>
                  <p className="text-[#9CA3AF] text-[15px] mb-2">No goals added yet.</p>
                  <p className="text-[#C4C9D4] text-[13px]">Click "Add a Goal" below to start building your bucket list.</p>
                </div>)}

              {goals.map(goal => (<div key={goal.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                  <div className="h-1" style={{ background: `linear-gradient(90deg, ${goal.color}, ${goal.color}60)` }}/>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${goal.color}14` }}>
                          <goal.Icon size={18} style={{ color: goal.color }}/>
                        </div>
                        <div>
                          <p className="font-bold text-[#0B0B0F] text-[16px]" style={serif}>{goal.label}</p>
                          <p className="text-[11px] font-bold" style={{ color: goal.monthly > 0 ? "#059669" : MGRAY }}>
                            {goal.monthly > 0 ? `${fmt(goal.monthly)}/month` : "Set corpus to calculate"}
                          </p>
                        </div>
                      </div>
                      <button type="button" aria-label={`Remove ${goal.label}`} onClick={() => removeGoal(goal.id)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all text-gray-400">
                        <Trash2 size={13}/>
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`goal-corpus-${goal.id}`} className="text-[11px] font-bold tracking-widest uppercase mb-2 block" style={{ color: MGRAY }}>Target Amount</label>
                        <select id={`goal-corpus-${goal.id}`} value={goal.corpus} onChange={e => updateGoal(goal.id, "corpus", Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-blue-300 bg-[#F4F6F9]">
                          {[500000, 1000000, 1500000, 2000000, 3000000, 4000000, 5000000, 7500000, 10000000, 15000000, 20000000, 30000000, 50000000].map(v => (<option key={v} value={v}>{fmt(v)}</option>))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`goal-years-${goal.id}`} className="text-[11px] font-bold tracking-widest uppercase mb-2 block" style={{ color: MGRAY }}>Years to Goal</label>
                        <select id={`goal-years-${goal.id}`} value={goal.years} onChange={e => updateGoal(goal.id, "years", Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-blue-300 bg-[#F4F6F9]">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 18, 20, 25, 30].map(v => (<option key={v} value={v}>{v} year{v > 1 ? "s" : ""}</option>))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 p-3.5 rounded-xl flex items-center justify-between" style={{ background: `${goal.color}08` }}>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: `${goal.color}25` }}>
                          <Check size={9} style={{ color: goal.color }}/>
                        </div>
                        <span className="text-[12px] text-[#6B7280]">At {(assumedRate * 100).toFixed(0)}% p.a. assumed returns</span>
                      </div>
                      <span className="font-bold text-[14px]" style={{ color: goal.color }}>Estimate: {fmt(goal.monthly)}/mo</span>
                    </div>
                  </div>
                </div>))}

              {/* Add goal */}
              {adding ? (<div className="bg-white rounded-3xl border border-blue-200 p-6" style={{ boxShadow: `0 4px 20px ${BLUE}12` }}>
                  <p className="font-semibold text-[#0B0B0F] text-[15px] mb-4" style={serif}>Choose a goal type</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                    {GOAL_OPTIONS.map((opt, i) => (<button type="button" aria-pressed={selectedType === i} key={opt.label} onClick={() => setSelectedType(i)} className="flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all text-center" style={{
                    background: selectedType === i ? "white" : GRAY,
                    borderColor: selectedType === i ? opt.color : "transparent",
                    boxShadow: selectedType === i ? `0 4px 16px ${opt.color}20` : "none",
                }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${opt.color}14` }}>
                          <opt.Icon size={14} style={{ color: opt.color }}/>
                        </div>
                        <span className="text-[11px] font-medium text-[#0B0B0F] leading-snug">{opt.label}</span>
                      </button>))}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={addGoal} className="flex-1 py-3 rounded-full text-white font-semibold text-[14px] transition-all hover:opacity-90" style={{ background: BLUE }}>
                      Add This Goal
                    </button>
                    <button type="button" onClick={() => setAdding(false)} className="px-6 py-3 rounded-full text-[#6B7280] font-semibold text-[14px] border border-gray-200 hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </div>) : (<button type="button" onClick={() => setAdding(true)} className="w-full py-4 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-2.5 text-[14px] font-semibold text-[#9CA3AF] hover:border-blue-300 hover:text-blue-500 transition-all">
                  <Plus size={16}/> Add a Goal
                </button>)}
            </div>

            {/* Summary card */}
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.08)" }}>
                <div className="px-6 py-5 border-b border-gray-100" style={{ background: `${BLUE}06` }}>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: BLUE }}>Your Summary</p>
                  <p className="font-bold text-[#0B0B0F] text-[18px]" style={serif}>{goals.length} Goal{goals.length !== 1 ? "s" : ""} Mapped</p>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label htmlFor="assumed-return" className="text-[10px] font-bold tracking-widest uppercase mb-2 block text-[#6B7280]">Assumed Annual Return</label>
                    <select id="assumed-return" value={assumedRate} onChange={e => changeRate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-blue-300 bg-[#F4F6F9]">
                      <option value={0.08}>8% p.a.</option>
                      <option value={0.10}>10% p.a.</option>
                      <option value={0.12}>12% p.a.</option>
                    </select>
                  </div>
                  {/* Total SIP */}
                  <div className="p-4 rounded-2xl" style={{ background: `${BLUE}08` }}>
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: BLUE }}>Estimated Monthly Investment</p>
                    <p className="text-[32px] font-bold" style={{ ...serif, color: BLUE }}>{goals.length ? fmt(totalSIP) : "—"}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">Illustrative total across selected goals</p>
                  </div>

                  {/* Total corpus */}
                  <div className="p-4 rounded-2xl bg-[#F4F6F9]">
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-1 text-[#6B7280]">Total Value of Selected Goals</p>
                    <p className="text-[24px] font-bold text-[#0B0B0F]" style={serif}>{goals.length ? fmt(totalCorpus) : "—"}</p>
                  </div>

                  {/* Per-goal summary */}
                  {goals.length > 0 && (<div className="space-y-2">
                      {goals.map(g => (<div key={g.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: g.color }}/>
                            <span className="text-[12px] text-[#374151] truncate max-w-[120px]">{g.label}</span>
                          </div>
                          <span className="text-[12px] font-bold tabular-nums" style={{ color: g.color }}>{fmt(g.monthly)}/mo</span>
                        </div>))}
                    </div>)}
                </div>

                <div className="px-6 pb-6">
                  {summaryStatus === "success" ? (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-center" aria-live="polite">
                      <Check size={18} className="mx-auto mb-2 text-emerald-600" />
                      <p className="text-[13px] font-semibold text-emerald-800">Your Bucket List summary request has been saved.</p>
                      {summaryRequestId && <p className="mt-1 text-[11px] text-emerald-700">Reference: {summaryRequestId}</p>}
                    </div>
                  ) : summaryOpen ? (
                    <form onSubmit={handleSummarySubmit} className="space-y-3 rounded-2xl border border-blue-100 bg-[#F4F6F9] p-4">
                      <div>
                        <label htmlFor="summary-name" className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Name *</label>
                        <input id="summary-name" name="name" required value={summaryForm.name} onChange={handleSummaryChange} autoComplete="name" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] outline-none focus:border-blue-400" />
                      </div>
                      <div>
                        <label htmlFor="summary-email" className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Email *</label>
                        <input id="summary-email" name="email" type="email" required value={summaryForm.email} onChange={handleSummaryChange} autoComplete="email" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] outline-none focus:border-blue-400" />
                      </div>
                      <div>
                        <label htmlFor="summary-phone" className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Phone (optional)</label>
                        <input id="summary-phone" name="phone" value={summaryForm.phone} onChange={handleSummaryChange} autoComplete="tel" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] outline-none focus:border-blue-400" />
                      </div>
                      <input tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={summaryForm.website} onChange={handleSummaryChange} className="absolute -left-[9999px] h-px w-px opacity-0" />
                      <label className="flex items-start gap-2 text-[11px] leading-relaxed text-[#6B7280]">
                        <input type="checkbox" name="consent" checked={summaryForm.consent} onChange={handleSummaryChange} required className="mt-0.5" />
                        <span>I agree that GrowVest may store these details and contact me regarding this educational estimate.</span>
                      </label>
                      {summaryError && <p className="text-[11px] text-red-600" role="alert">{summaryError}</p>}
                      <div className="flex gap-2">
                        <button type="submit" disabled={summaryStatus === "submitting" || goals.length === 0} className="flex-1 rounded-full bg-[#1F4ED8] px-4 py-3 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                          {summaryStatus === "submitting" ? "Saving..." : "Email My Summary"}
                        </button>
                        <button type="button" onClick={() => { setSummaryOpen(false); setSummaryError(""); }} className="rounded-full border border-gray-200 px-4 py-3 text-[12px] font-semibold text-[#6B7280]">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <button type="button" disabled={!goals.length} onClick={() => { setSummaryOpen(true); setSummaryStatus("idle"); }} className="flex w-full items-center justify-center gap-2 rounded-full border border-[#1F4ED8] px-4 py-3 text-[13px] font-semibold text-[#1F4ED8] transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40">
                        <Mail size={14} /> Email My Goal Summary
                      </button>
                      <Link href="/contact" data-analytics-event="primary_cta_click" data-analytics-location="bucket_builder_summary" className="gv-btn-primary block w-full text-center">
                        Begin Your Journey <ArrowRight size={14} className="inline ml-1.5"/>
                      </Link>
                    </div>
                  )}
                  <p className="text-center text-[11px] text-[#9CA3AF] mt-3">
                    Educational estimate using month-end contributions. Actual results depend on inflation, taxes, costs, timing and market conditions.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-gray-100 bg-white">
                <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: MGRAY }}>What's not in this estimate</p>
                <div className="space-y-2">
                  {["Inflation adjustment for each goal", "Tax and product suitability review", "Protection gap analysis", "Estate and nomination setup"].map(item => (<div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }}/>
                      <span className="text-[12px] text-[#6B7280]">{item}</span>
                    </div>))}
                </div>
                <Link href="/the-growvest-way" className="mt-4 text-[12px] font-semibold inline-flex items-center gap-1" style={{ color: BLUE }}>
                  See the full planning process →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-[680px] mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[36px] lg:text-[48px] font-bold text-[#0B0B0F] leading-tight mb-5" style={serif}>
            This Is an Estimate.<br />
            <em style={{ fontStyle: "italic", color: BLUE }}>Your Real Life Needs a Deeper Conversation.</em>
          </h2>
          <p className="text-[#6B7280] text-[16px] leading-relaxed mb-10">
            A complete planning discussion may consider inflation, existing savings, taxes, protection, liquidity and your changing life priorities. Start with the estimate, then discuss the assumptions.
          </p>
          <Link href="/contact" data-analytics-event="primary_cta_click" data-analytics-location="bucket_builder_final" className="gv-btn-primary inline-flex items-center gap-2.5">
            Begin Your Journey <ArrowRight size={17}/>
          </Link>
        </div>
      </section>
    </>);
}
