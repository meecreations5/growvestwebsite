"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Target, BarChart3, TrendingUp, FileText, Users, Briefcase, ChevronRight, Calendar, Shield, Star, GraduationCap, Home as HomeIcon, Plane, Globe, RefreshCw, AlertCircle, CheckCircle2, Clock, ChevronDown, Wallet, } from "lucide-react";
import { BLUE, BLACK, GOLD, WHITE, GRAY, MGRAY, RED, serif, dotGrid } from "../lib/brand";
// ─── DATA ─────────────────────────────────────────────────────────────────────
const REVIEW_POINTS = [
    {
        Icon: Target,
        label: "Bucket List Progress",
        desc: "Goal-by-goal status across all your mapped life goals.",
        detail: "Each goal is reviewed individually — how much corpus has been built, how much remains, whether the timeline is on track, and whether any adjustment is needed to the monthly contribution.",
        color: BLUE,
    },
    {
        Icon: BarChart3,
        label: "Goal-Wise Status",
        desc: "A clear status for each goal: On Track, Needs Attention, or Completed.",
        detail: "Every goal on your bucket list receives a status tag at each review. This creates accountability and ensures no goal silently falls behind without your knowledge.",
        color: GOLD,
    },
    {
        Icon: TrendingUp,
        label: "Monthly SIP Review",
        desc: "SIP performance reviewed against each goal's funding requirement.",
        detail: "We review whether your current SIP amount is sufficient for each goal's corpus target, whether the fund selection remains appropriate, and whether any SIP needs to be started, paused, or adjusted.",
        color: "#10B981",
    },
    {
        Icon: FileText,
        label: "Portfolio Movement",
        desc: "Portfolio allocation reviewed for drift, risk alignment, and goal proximity.",
        detail: "As markets move, your portfolio allocation drifts. We review whether rebalancing is required, whether your risk exposure is still appropriate, and whether any changes are needed given your goal timelines.",
        color: "#8B5CF6",
    },
    {
        Icon: Users,
        label: "Guide Note",
        desc: "A personal observation from your advisor on what matters this month.",
        detail: "A GrowVest guide can add a human note to a review — summarising their primary observation, what they want you to focus on, and any context that numbers alone cannot communicate.",
        color: BLUE,
    },
    {
        Icon: Briefcase,
        label: "Pending Documents",
        desc: "Any outstanding documentation or consent items that need attention.",
        detail: "Financial plans require documentation. This section tracks any pending KYC updates, nomination forms, insurance documents, or consent confirmations — ensuring nothing important is left incomplete.",
        color: "#F97316",
    },
    {
        Icon: ChevronRight,
        label: "Next Action Items",
        desc: "Clear, prioritised actions for both the investor and the advisor.",
        detail: "A structured review can end with a defined list of next actions — what you need to do, what the GrowVest team will follow up on, and by when. Actions are numbered by priority so nothing is ambiguous.",
        color: GOLD,
    },
    {
        Icon: Calendar,
        label: "Next Review Date",
        desc: "The confirmed date for the next structured review session.",
        detail: "Reviews are scheduled, not ad-hoc. Where appropriate, a review can close with the next session planned — so continuity is never dependent on who remembers to follow up.",
        color: "#EC4899",
    },
];
const GOALS_SAMPLE = [
    { Icon: GraduationCap, label: "Child Education", progress: 38, status: "On Track", color: GOLD, horizon: "2034" },
    { Icon: HomeIcon, label: "Dream Home", progress: 22, status: "Needs Attention", color: BLUE, horizon: "2029" },
    { Icon: Star, label: "Retirement", progress: 61, status: "On Track", color: "#8B5CF6", horizon: "2045" },
    { Icon: Shield, label: "Family Protection", progress: 90, status: "On Track", color: RED, horizon: "Active" },
    { Icon: Plane, label: "Travel & Experiences", progress: 15, status: "Just Started", color: "#EC4899", horizon: "2027" },
    { Icon: Wallet, label: "Emergency Fund", progress: 75, status: "On Track", color: "#14B8A6", horizon: "Active" },
    { Icon: TrendingUp, label: "Loan Closure", progress: 48, status: "On Track", color: BLUE, horizon: "2028" },
    { Icon: Globe, label: "Legacy Planning", progress: 10, status: "Early Stage", color: "#F97316", horizon: "2050" },
];
// ─── SECTION 1: HERO ──────────────────────────────────────────────────────────
function Hero() {
    return (<section className="relative min-h-[88vh] flex items-center overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `
          radial-gradient(ellipse 55% 65% at 18% 55%, rgba(31,78,216,0.18) 0%, transparent 65%),
          radial-gradient(ellipse 30% 40% at 82% 20%, rgba(245,179,1,0.07) 0%, transparent 60%)
        `,
        }}/>

      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 w-full py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_480px] gap-14 items-center">

          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: GOLD }}/>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>Progress Reviews</span>
            </div>
            <h1 className="text-[54px] xl:text-[68px] font-bold text-white mb-7 leading-[1.04]" style={serif}>
              Wealth Should Be<br />Reviewed, Not<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>Forgotten.</em>
            </h1>
            <p className="text-white/50 text-[17px] leading-relaxed mb-5 max-w-[520px]">
              GrowVest offers structured progress reviews that can cover goals, contribution discipline, documents, observations and next actions based on the agreed service cadence.
            </p>
            <p className="text-white/28 text-[14px] leading-relaxed mb-10 max-w-[460px]">
              Not a check-in call. A documented review with real outputs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#review-system" className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 lg:px-8 py-4 rounded-full text-white font-semibold text-[15px] transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: BLUE, boxShadow: `0 8px 32px ${BLUE}50` }}>
                See How Reviews Work <ArrowRight size={17}/>
              </a>
              <Link href="/your-goals" className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 lg:px-8 py-4 rounded-full font-semibold text-[15px] border transition-all hover:bg-white/5" style={{ borderColor: `${GOLD}45`, color: GOLD }}>
                Map Your Goals
              </Link>
            </div>
          </div>

          {/* Right: mini review card preview */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[40px] blur-3xl opacity-10 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 50%, ${BLUE}, transparent)` }}/>

            <div className="rounded-3xl overflow-hidden border border-white/10" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", boxShadow: "0 8px 60px rgba(0,0,0,0.40)" }}>
              {/* Card header */}
              <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${BLUE}12, transparent)` }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full" style={{ background: `linear-gradient(135deg, ${BLUE}, ${GOLD})` }}/>
                  <span className="text-white/55 text-[11px] font-bold tracking-widest uppercase">GrowVest Guidance</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: `${GOLD}20`, color: GOLD }}>July 2026</span>
              </div>
              <div className="px-6 py-4 border-b border-white/8">
                <p className="text-white font-bold text-[16px]" style={serif}>Monthly Bucket List Review</p>
                <p className="text-white/35 text-[12px] mt-0.5">Sample Investor · 8 Goals Active</p>
              </div>

              {/* Mini goal rows */}
              <div className="px-6 py-3 space-y-2.5">
                {GOALS_SAMPLE.slice(0, 5).map(({ Icon, label, progress, status, color }) => (<div key={label} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
                      <Icon size={11} style={{ color }}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5 gap-2">
                        <span className="text-white/70 text-[11px] font-medium truncate">{label}</span>
                        <span className="text-[9px] font-bold flex-shrink-0" style={{
                color: status === "On Track" ? "#10B981" : status === "Needs Attention" ? RED : GOLD,
            }}>{status}</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${color}, ${color}99)`,
            }}/>
                      </div>
                    </div>
                    <span className="text-white/40 text-[10px] font-bold tabular-nums flex-shrink-0">{progress}%</span>
                  </div>))}
              </div>

              {/* Guide note */}
              <div className="px-6 py-4 border-t border-white/8">
                <div className="p-3.5 rounded-xl" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}20` }}>
                  <p className="text-[9px] font-bold tracking-widest uppercase mb-1.5" style={{ color: BLUE }}>Guide Note</p>
                  <p className="text-white/50 text-[11px] leading-relaxed italic" style={serif}>
                    "Strong discipline on SIPs. Priority: resolve the dream home corpus gap before August."
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-white/8 flex items-center justify-between">
                <span className="text-white/25 text-[11px]">Next review: 15 Aug 2026</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10B981" }}/>
                  <span className="text-[10px] font-bold" style={{ color: "#10B981" }}>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
// ─── SECTION 2: WHY REVIEWS MATTER ───────────────────────────────────────────
const WHY_POINTS = [
    { heading: "Life changes. Your plan should too.", copy: "Income grows, families expand, goals shift, and markets move. A financial plan that is not reviewed regularly becomes misaligned with the life it is meant to serve." },
    { heading: "Numbers without context mislead.", copy: "A portfolio up 12% means little without context — is it enough for your goal timeline? Is your allocation still right? Reviews provide the context that numbers alone cannot." },
    { heading: "Accountability requires a witness.", copy: "When your financial journey is reviewed with a guide who understands your goals, you are far more likely to stay disciplined through market noise and life disruptions." },
];
function WhyReviewsMatter() {
    return (<section className="py-28 lg:py-40 bg-[#F4F6F9]">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-12" style={{ background: `linear-gradient(90deg, transparent, ${BLUE}40)` }}/>
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: MGRAY }}>Why It Matters</p>
        </div>

        <h2 className="text-[46px] lg:text-[62px] font-bold text-[#0B0B0F] leading-[1.06] mb-10" style={serif}>
          A Plan Without Review<br />Is Just a{" "}
          <span className="relative inline-block" style={{ color: BLUE }}>
            Wish.
            <span className="absolute left-0 right-0 block rounded-full" style={{ bottom: "-5px", height: "4px", background: GOLD }}/>
          </span>
        </h2>

        <div className="grid lg:grid-cols-3 gap-6 mt-14">
          {WHY_POINTS.map(({ heading, copy }, i) => (<div key={heading} className="p-7 bg-white rounded-3xl border border-gray-100 hover:border-blue-100 hover:-translate-y-1 transition-all group" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 8px 32px rgba(31,78,216,0.08)`)} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)")}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: BLUE }}>{String(i + 1).padStart(2, "0")}</div>
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${BLUE}20, transparent)` }}/>
              </div>
              <h4 className="text-[17px] font-bold text-[#0B0B0F] mb-3 leading-snug" style={serif}>{heading}</h4>
              <p className="text-[#6B7280] text-[14px] leading-relaxed">{copy}</p>
              <div className="mt-5 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}/>
            </div>))}
        </div>

        {/* Stat strip */}
        <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-gray-200 pt-10">
          {[
            { value: "12×", label: "Reviews per year" },
            { value: "8", label: "Review areas available" },
            { value: "Clear", label: "Documented next actions" },
        ].map(({ value, label }) => (<div key={label} className="flex items-baseline gap-3">
              <span className="text-[38px] font-bold" style={{ ...serif, color: BLUE }}>{value}</span>
              <span className="text-[#6B7280] text-[14px]">{label}</span>
              <div className="h-px w-6 ml-1" style={{ background: `${GOLD}40` }}/>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── SECTION 3: 8-POINT REVIEW EXPLORER ──────────────────────────────────────
function ReviewExplorer() {
    const [active, setActive] = useState(0);
    return (<section id="review-system" className="py-28 lg:py-36 relative" style={{ background: BLACK, ...dotGrid }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 55% 55% at 50% 50%, rgba(31,78,216,0.09) 0%, transparent 70%)`,
        }}/>

      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: GOLD }}>The 8-Point Review</p>
          <h2 className="text-[38px] lg:text-[52px] font-bold text-white leading-tight mb-4" style={serif}>
            Eight Areas for a<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>Structured Progress Review.</em>
          </h2>
          <p className="text-white/40 text-[15px] max-w-[500px] mx-auto leading-relaxed">
            The relevant areas are selected based on the client context, available information and agreed service scope.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {REVIEW_POINTS.map((point, i) => {
            const isOpen = active === i;
            const { Icon, label, desc, detail, color } = point;
            return (<div key={label} role="button" tabIndex={0} aria-expanded={isOpen} className="rounded-2xl border overflow-hidden transition-all duration-200 cursor-pointer" style={{
                    background: isOpen ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                    borderColor: isOpen ? `${color}50` : "rgba(255,255,255,0.08)",
                    boxShadow: isOpen ? `0 4px 30px ${color}15` : "none",
                }} onClick={() => setActive(isOpen ? null : i)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActive(isOpen ? null : i); } }}>

                <div className="flex items-center gap-4 p-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isOpen ? `${color}25` : "rgba(255,255,255,0.07)" }}>
                    <Icon size={17} style={{ color: isOpen ? color : "rgba(255,255,255,0.35)" }}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold tabular-nums" style={{ color: `${GOLD}60` }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-semibold text-[14px]" style={{ ...serif, color: isOpen ? WHITE : "rgba(255,255,255,0.65)" }}>
                        {label}
                      </p>
                    </div>
                    <p className="text-white/30 text-[12px] leading-snug">{desc}</p>
                  </div>
                  <ChevronDown size={14} className="flex-shrink-0 transition-transform duration-200" style={{ color: isOpen ? color : "rgba(255,255,255,0.20)", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}/>
                </div>

                {isOpen && (<div className="px-5 pb-5 border-t border-white/6">
                    <p className="text-white/55 text-[13.5px] leading-relaxed pt-4">{detail}</p>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                      <Check size={10}/> Available review area
                    </div>
                  </div>)}
              </div>);
        })}
        </div>
      </div>
    </section>);
}
// ─── SECTION 4: FULL REVIEW REPORT MOCKUP ────────────────────────────────────
function ReviewReportMockup() {
    const [activeGoal, setActiveGoal] = useState(0);
    const goal = GOALS_SAMPLE[activeGoal];
    return (<section className="py-28 lg:py-36 bg-white">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>Sample Review</p>
          <h2 className="text-[38px] lg:text-[50px] font-bold text-[#0B0B0F] leading-tight mb-4" style={serif}>
            What a GrowVest<br />
            <em style={{ fontStyle: "italic", color: BLUE }}>Monthly Review Looks Like.</em>
          </h2>
          <p className="text-[#6B7280] text-[16px] max-w-[500px] mx-auto leading-relaxed">
            An illustrative review format showing how goals, documents and next actions can be brought together.
          </p>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
          {/* Left: report card */}
          <div className="lg:sticky lg:top-24 rounded-3xl overflow-hidden border border-gray-100" style={{ boxShadow: "0 8px 56px rgba(0,0,0,0.10)" }}>
            {/* Letterhead */}
            <div className="px-7 py-5 border-b border-gray-100" style={{ background: `linear-gradient(135deg, ${BLUE}08, transparent)` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full" style={{ background: `linear-gradient(135deg, ${BLUE}, ${GOLD})` }}/>
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: MGRAY }}>GrowVest Guidance</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: `${GOLD}18`, color: "#7A5200", border: `1px solid ${GOLD}30` }}>Active</span>
              </div>
              <p className="font-bold text-[18px] text-[#0B0B0F]" style={serif}>Monthly Bucket List Review</p>
              <p className="text-[#6B7280] text-[12px] mt-0.5">Sample Investor · July 2026</p>
            </div>

            {/* Overall progress ring */}
            <div className="px-7 py-5 border-b border-gray-100 flex items-center gap-5">
              <div className="relative flex-shrink-0">
                <svg width="76" height="76" viewBox="0 0 76 76">
                  <circle cx="38" cy="38" r="30" fill="none" stroke="#E8ECF4" strokeWidth="5"/>
                  <circle cx="38" cy="38" r="30" fill="none" stroke="url(#rv1)" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 30 * 0.58} ${2 * Math.PI * 30 * 0.42}`} transform="rotate(-90 38 38)"/>
                  <defs>
                    <linearGradient id="rv1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={BLUE}/><stop offset="100%" stopColor={GOLD}/>
                    </linearGradient>
                  </defs>
                  <text x="38" y="42" textAnchor="middle" fontSize="13" fontWeight="700" fill={BLUE}>58%</text>
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: MGRAY }}>Overall Progress</p>
                <p className="text-[#0B0B0F] font-bold text-[20px]" style={serif}>58% on Track</p>
                <p className="text-[#6B7280] text-[12px]">5 of 8 goals progressing</p>
              </div>
            </div>

            {/* Status rows */}
            {[
            { label: "Monthly SIP", value: "Active", ok: true },
            { label: "Portfolio", value: "Review Recommended", ok: null },
            { label: "Insurance", value: "Gap Under Discussion", ok: false },
            { label: "Documents", value: "1 Pending", ok: false },
            { label: "Next Review", value: "15 August 2026", ok: null },
        ].map(({ label, value, ok }) => (<div key={label} className="flex items-center justify-between px-7 py-3 border-b border-gray-50 last:border-0">
                <span className="text-[#6B7280] text-[13px]">{label}</span>
                <span className="text-[12.5px] font-semibold" style={{
                color: ok === true ? "#059669" : ok === false ? RED : "#374151",
            }}>{value}</span>
              </div>))}

            {/* Guide note */}
            <div className="px-7 py-5 bg-[#F4F6F9]">
              <div className="p-4 rounded-2xl bg-white" style={{ border: `1px solid ${BLUE}15`, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <p className="text-[9px] font-bold tracking-widest uppercase mb-1.5" style={{ color: BLUE }}>Guide Note</p>
                <p className="text-[#374151] text-[12.5px] leading-relaxed italic" style={serif}>
                  "Solid SIP discipline. Priority for August is the portfolio review and closing the insurance gap conversation."
                </p>
              </div>
            </div>
          </div>

          {/* Right: interactive goal breakdown */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-6" style={{ color: MGRAY }}>Goal-Wise Status</p>

            {/* Goal selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
              {GOALS_SAMPLE.map((g, i) => {
            const isActive = activeGoal === i;
            return (<button type="button" aria-pressed={activeGoal === i} key={g.label} onClick={() => setActiveGoal(i)} className="flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all text-center" style={{
                    background: isActive ? WHITE : GRAY,
                    borderColor: isActive ? g.color : "rgba(0,0,0,0.06)",
                    boxShadow: isActive ? `0 4px 20px ${g.color}20` : "none",
                }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${g.color}18` }}>
                      <g.Icon size={15} style={{ color: g.color }}/>
                    </div>
                    <span className="text-[11px] font-semibold text-[#0B0B0F] leading-snug">{g.label}</span>
                    <span className="text-[10px] font-bold" style={{
                    color: g.status === "On Track" ? "#059669" : g.status === "Needs Attention" ? RED : g.color,
                }}>{g.progress}%</span>
                  </button>);
        })}
            </div>

            {/* Active goal detail */}
            <div className="rounded-3xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
              <div className="px-7 py-5 border-b border-gray-100 flex items-center gap-4" style={{ background: `${goal.color}08` }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${goal.color}20` }}>
                  <goal.Icon size={18} style={{ color: goal.color }}/>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[16px] text-[#0B0B0F]" style={serif}>{goal.label}</p>
                  <p className="text-[#6B7280] text-[12px]">Target Year: {goal.horizon}</p>
                </div>
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-full" style={{
            background: goal.status === "On Track" ? "#D1FAE5" : goal.status === "Needs Attention" ? "#FEE2E2" : `${goal.color}15`,
            color: goal.status === "On Track" ? "#059669" : goal.status === "Needs Attention" ? RED : goal.color,
        }}>{goal.status}</span>
              </div>

              {/* Progress bar */}
              <div className="px-7 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[12px] font-semibold text-[#0B0B0F]">Corpus Progress</span>
                  <span className="text-[14px] font-bold" style={{ color: goal.color }}>{goal.progress}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${goal.progress}%`, background: `linear-gradient(90deg, ${goal.color}, ${goal.color}AA)` }}/>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[11px] text-[#9CA3AF]">Started</span>
                  <span className="text-[11px] text-[#9CA3AF]">{goal.horizon}</span>
                </div>
              </div>

              {/* Review items for this goal */}
              <div className="px-7 py-5 grid grid-cols-2 gap-3">
                {[
            { label: "SIP on Schedule", ok: true },
            { label: "Risk Profile Match", ok: true },
            { label: "Corpus on Target", ok: goal.status === "On Track" },
            { label: "No Pending Action", ok: goal.status !== "Needs Attention" },
        ].map(({ label, ok }) => (<div key={label} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F4F6F9]">
                    {ok
                ? <CheckCircle2 size={14} style={{ color: "#059669" }}/>
                : <AlertCircle size={14} style={{ color: RED }}/>}
                    <span className="text-[12px] font-medium text-[#374151]">{label}</span>
                  </div>))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
// ─── SECTION 5: REVIEW CADENCE ────────────────────────────────────────────────
const CADENCE_ITEMS = [
    { Icon: Calendar, freq: "Agreed cadence", title: "Structured Progress Review", copy: "A review session covering the relevant areas, documented observations, priority actions and an appropriate follow-up plan." },
    { Icon: TrendingUp, freq: "Quarterly", title: "Portfolio Alignment Check", copy: "A deeper portfolio review every quarter — assessing allocation drift, rebalancing requirement, and goal proximity changes." },
    { Icon: Star, freq: "Annual", title: "Full Goal Reassessment", copy: "An annual review of all goals — timelines, corpus targets, and priority — to ensure your plan reflects your current life." },
    { Icon: AlertCircle, freq: "As Needed", title: "Life Event Triggered Review", copy: "A review triggered by significant life events — job change, new family member, large expense, or market disruption." },
];
function ReviewCadence() {
    return (<section className="py-28 lg:py-36 bg-[#F4F6F9]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[400px_1fr] gap-14 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>Review Cadence</p>
            <h2 className="text-[38px] lg:text-[48px] font-bold text-[#0B0B0F] leading-tight mb-5" style={serif}>
              Structured Reviews at Every Stage of Your Journey.
            </h2>
            <p className="text-[#6B7280] text-[15px] leading-relaxed mb-8">
              GrowVest's review approach is designed to be proactive. Reviews can be scheduled and structured so important goals and actions receive regular attention.
            </p>
            <div className="flex items-center gap-3">
              <div className="h-1 rounded-full" style={{ width: "80px", background: `linear-gradient(90deg, ${BLUE}, ${GOLD})` }}/>
              <span className="text-[11px] text-[#6B7280] font-medium">Review Calendar</span>
            </div>
          </div>

          <div className="space-y-4">
            {CADENCE_ITEMS.map(({ Icon, freq, title, copy }) => {
            const freqColor = freq === "Monthly" ? BLUE : freq === "Quarterly" ? "#8B5CF6" : freq === "Annual" ? "#10B981" : GOLD;
            return (<div key={title} className="flex gap-6 p-6 lg:p-8 bg-white rounded-3xl border border-gray-100 hover:border-blue-100 hover:-translate-y-0.5 transition-all group" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${freqColor}12` }}>
                      <Icon size={19} style={{ color: freqColor }}/>
                    </div>
                    <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: `${freqColor}12`, color: freqColor }}>{freq}</span>
                  </div>
                  <div>
                    <h4 className="text-[17px] font-bold text-[#0B0B0F] mb-2 group-hover:text-blue-700 transition-colors" style={serif}>{title}</h4>
                    <p className="text-[#6B7280] text-[14px] leading-relaxed">{copy}</p>
                  </div>
                </div>);
        })}
          </div>
        </div>
      </div>
    </section>);
}
// ─── SECTION 6: WHAT CHANGES AFTER A REVIEW ──────────────────────────────────
const OUTCOMES = [
    { Icon: Check, title: "Clear Next Actions", copy: "A review can end with a prioritised list of actions for the client and GrowVest team before the next conversation." },
    { Icon: RefreshCw, title: "Funding Question Identified", copy: "If a goal appears off track, the review can identify the assumption or contribution question that needs further consideration." },
    { Icon: FileText, title: "Updated Progress Report", copy: "After each review, an updated progress report is shared — showing goal status, changes from last month, and current trajectory." },
    { Icon: Shield, title: "Protection Gap Flagged", copy: "If an insurance gap or documentation issue surfaces, it is flagged explicitly — not left for the investor to discover later." },
    { Icon: Calendar, title: "Follow-Up Planned", copy: "Where appropriate, the next progress conversation can be planned before the current session closes." },
    { Icon: Users, title: "Guide Note Documented", copy: "The advisor's personal observation is written and shared — creating a continuous narrative of the investor's journey over time." },
];
function WhatChanges() {
    return (<section className="py-28 lg:py-36 bg-white">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>Review Outcomes</p>
          <h2 className="text-[38px] lg:text-[50px] font-bold text-[#0B0B0F] leading-tight mb-4" style={serif}>
            What Happens After<br />
            <em style={{ fontStyle: "italic", color: BLUE }}>A Progress Review.</em>
          </h2>
          <p className="text-[#6B7280] text-[16px] max-w-[500px] mx-auto leading-relaxed">
            A GrowVest review does not end with the conversation. It ends with documented outputs, confirmed actions, and a clear next step.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {OUTCOMES.map(({ Icon, title, copy }, i) => (<div key={title} className="p-7 rounded-3xl border border-gray-100 hover:border-blue-100 hover:-translate-y-1 transition-all group" style={{ background: GRAY, boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 8px 32px rgba(31,78,216,0.08)`)} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)")}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${BLUE}10` }}>
                  <Icon size={16} style={{ color: BLUE }}/>
                </div>
                <div className="w-2 h-2 rounded-full" style={{ background: GOLD }}/>
              </div>
              <h4 className="font-bold text-[#0B0B0F] text-[15px] mb-2 leading-snug" style={serif}>{title}</h4>
              <p className="text-[#6B7280] text-[13.5px] leading-relaxed">{copy}</p>
              <div className="mt-5 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}/>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── SECTION 7: BEFORE VS AFTER ───────────────────────────────────────────────
const BEFORE_AFTER = [
    ["Goals exist in your head", "Goals are mapped, tagged, and tracked"],
    ["SIPs running without a purpose assigned", "Every SIP tied to a specific goal"],
    ["Portfolio reviewed only when worried", "Portfolio questions reviewed at an agreed cadence"],
    ["Insurance gaps remain undiscovered", "Protection gaps flagged and addressed"],
    ["No record of what was recommended", "Important decisions documented clearly"],
    ["Next steps forgotten after the meeting", "Next actions confirmed in writing every time"],
];
function BeforeAfter() {
    return (<section className="py-28 lg:py-36 relative" style={{ background: BLACK, ...dotGrid }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 50% 50% at 25% 50%, rgba(31,78,216,0.09) 0%, transparent 70%)`,
        }}/>

      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: GOLD }}>Before vs After</p>
          <h2 className="text-[38px] lg:text-[50px] font-bold text-white leading-tight" style={serif}>
            What Changes When Your<br />Wealth is Reviewed Regularly.
          </h2>
        </div>

        <div className="rounded-3xl overflow-hidden border border-white/8" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 4px 40px rgba(0,0,0,0.30)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-white/8">
            <div className="px-8 py-5 border-r border-white/8">
              <div className="flex items-center gap-3">
                <Clock size={15} className="text-white/30"/>
                <span className="font-bold text-white/40 text-[14px]" style={serif}>Without Regular Reviews</span>
              </div>
            </div>
            <div className="px-8 py-5" style={{ background: `${BLUE}08` }}>
              <div className="flex items-center gap-3">
                <RefreshCw size={15} style={{ color: BLUE }}/>
                <span className="font-bold text-white text-[14px]" style={serif}>With GrowVest Reviews</span>
              </div>
            </div>
          </div>
          {BEFORE_AFTER.map(([before, after], i) => (<div key={i} className="grid grid-cols-1 border-b border-white/6 last:border-0 sm:grid-cols-2 hover:bg-white/3 transition-colors">
              <div className="px-8 py-4 flex items-center gap-3 border-r border-white/6">
                <div className="w-4 h-4 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0">
                  <span className="text-white/30 text-[9px]">✕</span>
                </div>
                <span className="text-white/35 text-[13px]">{before}</span>
              </div>
              <div className="px-8 py-4 flex items-center gap-3">
                <Check size={13} style={{ color: GOLD }} className="flex-shrink-0"/>
                <span className="text-white/75 text-[13px] font-medium">{after}</span>
              </div>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── SECTION 8: CTA ───────────────────────────────────────────────────────────
function ProgressReviewsCTA() {
    return (<section className="relative py-36 lg:py-52 overflow-hidden" style={{ background: BLACK, ...dotGrid }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 65% 65% at 50% 50%, rgba(31,78,216,0.14) 0%, transparent 70%)`,
        }}/>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-28 pointer-events-none" style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}50)` }}/>

      {["Monthly Review", "Goal Progress", "SIP Review", "Guide Note", "Next Actions", "Portfolio Check"].map((label, i) => (<div key={label} className="absolute pointer-events-none select-none" style={{ color: "rgba(255,255,255,0.05)", top: `${12 + (i * 13) % 75}%`, left: `${4 + (i * 16) % 88}%`, transform: `rotate(${-8 + (i * 6) % 16}deg)`, fontFamily: "'Libre Baskerville', serif", fontSize: "13px" }}>
          {label}
        </div>))}

      <div className="max-w-[800px] mx-auto px-5 sm:px-6 lg:px-8 text-center relative">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-10" style={{ background: `${GOLD}40` }}/>
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: GOLD }}>Begin Your Journey</span>
          <div className="h-px w-10" style={{ background: `${GOLD}40` }}/>
        </div>

        <h2 className="text-[48px] lg:text-[68px] font-bold text-white mb-6 leading-[1.04]" style={serif}>
          Your Progress Deserves<br />
          <em style={{ fontStyle: "italic", color: GOLD }}>to Be Seen.</em>
        </h2>

        <p className="text-white/45 text-[17px] leading-relaxed mb-12 max-w-[500px] mx-auto">
          Start your GrowVest journey with structured progress conversations, documented next actions and genuine human support.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" data-analytics-event="primary_cta_click" data-analytics-location="page_final_cta" className="gv-btn-primary inline-flex items-center gap-3">
            Begin Your Journey <ArrowRight size={19}/>
          </Link>
          <Link href="/your-goals" data-analytics-event="secondary_cta_click" data-analytics-location="page_final_cta" className="gv-btn-secondary gv-btn-secondary--dark inline-flex items-center gap-2">
            Explore Your Goals
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 mt-12">
          {["Progress Reviews", "Eight Review Areas", "Clear Next Actions"].map((item) => (<div key={item} className="flex items-center gap-2">
              <Check size={12} style={{ color: GOLD }}/>
              <span className="text-white/25 text-[12px]">{item}</span>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function ProgressReviews() {
    return (<>
      <Hero />
      <WhyReviewsMatter />
      <ReviewExplorer />
      <ReviewReportMockup />
      <ReviewCadence />
      <WhatChanges />
      <BeforeAfter />
      <ProgressReviewsCTA />
    </>);
}
