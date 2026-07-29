"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Users, Map, RefreshCw, ChevronDown, Shield, Target, FileText, BarChart3, ClipboardList, Compass, Lock, Star, TrendingUp, Calendar, Eye, MessageSquare, Award, } from "lucide-react";
import { BLUE, BLACK, GOLD, WHITE, GRAY, MGRAY, RED, serif, dotGrid } from "../lib/brand";
// ─── SECTION 1: HERO ──────────────────────────────────────────────────────────
function Hero() {
    return (<section className="relative min-h-[88vh] flex items-center overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `
          radial-gradient(ellipse 55% 60% at 18% 55%, rgba(31,78,216,0.18) 0%, transparent 65%),
          radial-gradient(ellipse 35% 40% at 82% 20%, rgba(245,179,1,0.07) 0%, transparent 60%)
        `,
        }}/>

      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 w-full py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_420px] gap-14 items-center">

          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: GOLD }}/>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
                The GrowVest Way
              </span>
            </div>

            <h1 className="text-[54px] xl:text-[68px] font-bold text-white mb-7 leading-[1.04]" style={serif}>
              A Disciplined Way<br />to Build Wealth.<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>A Human Way to Guide It.</em>
            </h1>

            <p className="text-white/50 text-[17px] leading-relaxed mb-5 max-w-[520px]">
              GrowVest follows a structured guidance journey — from understanding your life goals to building a financial roadmap, and then keeping you on track with regular reviews.
            </p>
            <p className="text-white/28 text-[14px] leading-relaxed mb-10 max-w-[460px]">
              Not a one-time recommendation. Not a product pitch. A thoughtful, ongoing wealth-guidance relationship.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#three-phases" className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 lg:px-8 py-4 rounded-full text-white font-semibold text-[15px] transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: BLUE, boxShadow: `0 8px 32px ${BLUE}50` }}>
                Explore Our Process <ArrowRight size={17}/>
              </a>
              <Link href="/your-goals" className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 lg:px-8 py-4 rounded-full font-semibold text-[15px] border transition-all hover:bg-white/5" style={{ borderColor: `${GOLD}45`, color: GOLD }}>
                Map Your Goals
              </Link>
            </div>
          </div>

          {/* Right: 3-phase summary cards */}
          <div className="space-y-3">
            {[
            { Icon: Users, num: "01", label: "Understand You", sub: "Discovery · Assessment · Bucket List · Risk Profile", color: BLUE },
            { Icon: Map, num: "02", label: "Build Your Roadmap", sub: "Goal-Based Plan · Documentation · Execution", color: GOLD },
            { Icon: RefreshCw, num: "03", label: "Keep You on Track", sub: "Monthly Review · Progress Report · Ongoing Guidance", color: "#10B981" },
        ].map(({ Icon, num, label, sub, color }) => (<a href="#three-phases" key={num} className="flex items-center gap-5 p-5 rounded-2xl border transition-all hover:-translate-y-0.5 group cursor-pointer block" style={{ background: "rgba(255,255,255,0.055)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.10)" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${GOLD}50`)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)")}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ background: `${color}22` }}>
                  <Icon size={18} style={{ color }}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold tabular-nums" style={{ color: `${GOLD}70` }}>Phase {num}</span>
                  </div>
                  <p className="text-white font-semibold text-[14px]" style={serif}>{label}</p>
                  <p className="text-white/35 text-[11px] mt-0.5 truncate">{sub}</p>
                </div>
                <ChevronDown size={14} className="flex-shrink-0 -rotate-90" style={{ color: "rgba(255,255,255,0.20)" }}/>
              </a>))}
            <div className="flex items-center gap-3 pt-2 pl-2">
              <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${GOLD}30, transparent)` }}/>
              <span className="text-white/18 text-[11px]">A continuous journey, not a transaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
// ─── SECTION 2: PHILOSOPHY ────────────────────────────────────────────────────
const PILLARS = [
    { Icon: Target, title: "Goal-Led Always", copy: "Every financial decision — from SIP amount to insurance coverage — is anchored to a specific life goal on your bucket list. Never a product, always a purpose." },
    { Icon: Users, title: "Human at Every Step", copy: "GrowVest is not an algorithm. Important conversations are supported by a human team that understands your goals and context." },
    { Icon: ClipboardList, title: "Structured by Design", copy: "We follow a documented guidance process with clear steps and deliverables to improve continuity and accountability." },
    { Icon: Lock, title: "Transparent by Default", copy: "We communicate clearly, document every direction, and take only consent-based steps. No hidden claims and no unexplained next steps." },
];
function Philosophy() {
    return (<section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>Our Philosophy</p>
          <h2 className="text-[38px] lg:text-[50px] font-bold text-[#0B0B0F] leading-tight mb-4" style={serif}>
            Four Principles That<br />
            <em style={{ fontStyle: "italic", color: BLUE }}>Define How We Work.</em>
          </h2>
          <p className="text-[#6B7280] text-[16px] max-w-[520px] mx-auto leading-relaxed">
            GrowVest is built on a philosophy that puts your life goals before products, and your clarity before our convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {PILLARS.map(({ Icon, title, copy }, i) => (<div key={title} className="flex gap-6 p-7 lg:p-8 rounded-3xl border border-gray-100 hover:border-blue-100 hover:-translate-y-0.5 transition-all group" style={{ background: GRAY, boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${BLUE}12` }}>
                  <Icon size={20} style={{ color: BLUE }}/>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-[18px] font-bold text-[#0B0B0F]" style={serif}>{title}</h3>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: GOLD }}/>
                </div>
                <p className="text-[#6B7280] text-[14px] leading-relaxed">{copy}</p>
              </div>
            </div>))}
        </div>

        {/* Belief bar */}
        <div className="mt-10 p-6 lg:p-8 rounded-3xl flex flex-col lg:flex-row items-center gap-6" style={{ background: `linear-gradient(135deg, ${BLUE}08, ${GOLD}06)`, border: `1px solid ${BLUE}15` }}>
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${BLUE}15` }}>
            <MessageSquare size={20} style={{ color: BLUE }}/>
          </div>
          <p className="text-[#374151] text-[16px] leading-relaxed italic text-center lg:text-left" style={serif}>
            "We do not begin with what we have to offer. We begin with what you need to protect and transform."
          </p>
          <div className="lg:ml-auto flex-shrink-0">
            <span className="text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-full" style={{ background: `${GOLD}20`, color: "#7A5200" }}>GrowVest Belief</span>
          </div>
        </div>
      </div>
    </section>);
}
// ─── SECTION 3: THREE PHASES DEEP-DIVE ───────────────────────────────────────
const PHASES = [
    {
        Icon: Users,
        num: "01",
        title: "Understand You",
        tagline: "Before we plan, we listen.",
        copy: "The first phase is entirely about understanding your life — not your portfolio. We explore your responsibilities, aspirations, family priorities, and financial position with no agenda other than clarity.",
        color: BLUE,
        steps: [
            { title: "Discovery Conversation", copy: "A structured, unhurried conversation about your life — your income, family, responsibilities, and long-term hopes. No forms, no product presentation.", deliverable: "Summary Note" },
            { title: "Investor Assessment", copy: "A thorough review of your current financial position — assets, liabilities, cash flows, and existing investments — to understand where you stand today.", deliverable: "Assessment Report" },
            { title: "Bucket List Mapping", copy: "Together, we map your life goals across Protect, Transform, and Review — attaching timelines, priority levels, and estimated financial gaps to each goal.", deliverable: "Bucket List Map" },
            { title: "Risk Profile Review", copy: "We assess your risk comfort, investment horizon, and behavioural tendencies — so every direction is suitable, not just suitable-sounding.", deliverable: "Risk Profile Document" },
        ],
        output: "Investor Assessment Report + Bucket List Map + Risk Profile",
    },
    {
        Icon: Map,
        num: "02",
        title: "Build Your Roadmap",
        tagline: "Clarity becomes a structured direction.",
        copy: "Once we understand your goals and financial position, we create a structured plan — connecting each life goal to a specific financial direction, timeline, and monthly commitment.",
        color: GOLD,
        steps: [
            { title: "Goal-Based Plan", copy: "A comprehensive financial plan that assigns each bucket list goal a target corpus, a recommended funding approach, and a structured review schedule.", deliverable: "Goal-Based Financial Plan" },
            { title: "Documentation & Consent", copy: "Important directions are documented clearly. Any action should proceed only after your understanding and consent.", deliverable: "Signed Documentation" },
            { title: "Execution Support", copy: "We support the practical execution of the plan — from SIP setup to insurance placement — ensuring every step happens with coordination and follow-through.", deliverable: "Execution Confirmation" },
        ],
        output: "Goal-Based Financial Plan + Documentation + Execution Confirmation",
    },
    {
        Icon: RefreshCw,
        num: "03",
        title: "Keep You on Track",
        tagline: "A financial journey never really ends.",
        copy: "A financial journey needs more than a one-time conversation. GrowVest supports regular progress reviews because life, priorities and markets can change.",
        color: "#10B981",
        steps: [
            { title: "Scheduled Review", copy: "A structured review of goal progress, contribution discipline, material changes and pending actions, based on the cadence agreed for the engagement.", deliverable: "Progress Review Summary" },
            { title: "Progress Report", copy: "A comprehensive progress report tied to your bucket list — showing how far each goal has come, what is on track, and what needs attention.", deliverable: "Bucket List Progress Report" },
            { title: "Ongoing Guidance", copy: "A consistent point of contact for goal changes, life events and important planning questions within the agreed service scope.", deliverable: "Guide Access" },
        ],
        output: "Progress Review Summaries + Goal Updates + Ongoing Guide Access",
    },
];
function ThreePhases() {
    const [activePhase, setActivePhase] = useState(0);
    const [activeStep, setActiveStep] = useState(null);
    return (<section id="three-phases" className="py-28 lg:py-36 relative" style={{ background: BLACK, ...dotGrid }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 55% 60% at 50% 50%, rgba(31,78,216,0.10) 0%, transparent 70%)`,
        }}/>

      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: GOLD }}>Our Process</p>
          <h2 className="text-[38px] lg:text-[52px] font-bold text-white leading-tight mb-4" style={serif}>
            Three Phases.<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>One Continuous Journey.</em>
          </h2>
          <p className="text-white/40 text-[15px] max-w-[500px] mx-auto leading-relaxed">
            Select a phase to explore what happens at each step — and what you receive as a result.
          </p>
        </div>

        {/* Phase selector tabs */}
        <div className="flex flex-col lg:flex-row gap-3 mb-10">
          {PHASES.map(({ Icon, num, title, color }, i) => {
            const isActive = activePhase === i;
            return (<button type="button" aria-pressed={activePhase === i} key={num} onClick={() => { setActivePhase(i); setActiveStep(null); }} className="flex-1 flex items-center gap-4 p-5 rounded-2xl border text-left transition-all" style={{
                    background: isActive ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)",
                    borderColor: isActive ? `${color}60` : "rgba(255,255,255,0.08)",
                    boxShadow: isActive ? `0 4px 30px ${color}20` : "none",
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isActive ? `${color}30` : `${color}15` }}>
                  <Icon size={18} style={{ color }}/>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest mb-0.5" style={{ color: isActive ? color : "rgba(255,255,255,0.30)" }}>Phase {num}</p>
                  <p className="font-semibold text-[14px]" style={{ ...serif, color: isActive ? WHITE : "rgba(255,255,255,0.55)" }}>{title}</p>
                </div>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }}/>}
              </button>);
        })}
        </div>

        {/* Active phase content */}
        {(() => {
            const phase = PHASES[activePhase];
            return (<div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
              {/* Left: phase overview */}
              <div className="p-7 lg:p-8 rounded-3xl border" style={{ background: "rgba(255,255,255,0.06)", borderColor: `${phase.color}30`, boxShadow: `0 4px 30px ${phase.color}10` }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${phase.color}25` }}>
                  <phase.Icon size={22} style={{ color: phase.color }}/>
                </div>
                <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: phase.color }}>Phase {phase.num}</p>
                <h3 className="text-[26px] font-bold text-white mb-2 leading-snug" style={serif}>{phase.title}</h3>
                <p className="text-[14px] font-semibold mb-4" style={{ color: `${phase.color}CC` }}>{phase.tagline}</p>
                <p className="text-white/45 text-[14px] leading-relaxed mb-8">{phase.copy}</p>

                {/* Output */}
                <div className="p-4 rounded-2xl" style={{ background: `${phase.color}10`, border: `1px solid ${phase.color}25` }}>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: phase.color }}>What You Receive</p>
                  <p className="text-white/60 text-[13px] leading-relaxed">{phase.output}</p>
                </div>
              </div>

              {/* Right: step accordion */}
              <div className="space-y-3">
                {phase.steps.map((step, j) => {
                    const isOpen = activeStep === j;
                    return (<div key={step.title} role="button" tabIndex={0} aria-expanded={isOpen} className="rounded-2xl border overflow-hidden transition-all duration-200 cursor-pointer" style={{
                            background: isOpen ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                            borderColor: isOpen ? `${phase.color}50` : "rgba(255,255,255,0.08)",
                        }} onClick={() => setActiveStep(isOpen ? null : j)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveStep(isOpen ? null : j); } }}>
                      {/* Step header */}
                      <div className="flex items-center gap-4 p-5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold" style={{ background: isOpen ? `${phase.color}30` : "rgba(255,255,255,0.07)", color: isOpen ? phase.color : "rgba(255,255,255,0.40)" }}>
                          {String(j + 1).padStart(2, "0")}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-[15px]" style={serif}>{step.title}</p>
                          {step.deliverable && !isOpen && (<p className="text-white/25 text-[11px] mt-0.5">→ {step.deliverable}</p>)}
                        </div>
                        <ChevronDown size={15} className="flex-shrink-0 transition-transform duration-200" style={{ color: isOpen ? phase.color : "rgba(255,255,255,0.25)", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}/>
                      </div>

                      {/* Step body */}
                      {isOpen && (<div className="px-5 pb-5 border-t border-white/6">
                          <p className="text-white/55 text-[14px] leading-relaxed pt-4 mb-4">{step.copy}</p>
                          {step.deliverable && (<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold" style={{ background: `${phase.color}15`, color: phase.color, border: `1px solid ${phase.color}30` }}>
                              <Check size={10}/> {step.deliverable}
                            </div>)}
                        </div>)}
                    </div>);
                })}
              </div>
            </div>);
        })()}

        {/* Phase progress line */}
        <div className="flex items-center gap-0 mt-12 max-w-xs mx-auto">
          {PHASES.map(({ color }, i) => (<div key={i} className="flex items-center flex-1">
              <div className="w-3 h-3 rounded-full flex-shrink-0 transition-all" style={{ background: i <= activePhase ? color : "rgba(255,255,255,0.12)", boxShadow: i === activePhase ? `0 0 10px ${color}` : "none" }}/>
              {i < PHASES.length - 1 && <div className="flex-1 h-px transition-all" style={{ background: i < activePhase ? `${PHASES[i + 1].color}60` : "rgba(255,255,255,0.08)" }}/>}
            </div>))}
        </div>
        <p className="text-center text-white/18 text-[11px] mt-3">Phase {activePhase + 1} of {PHASES.length} active</p>
      </div>
    </section>);
}
// ─── SECTION 4: GUIDANCE STANDARDS ───────────────────────────────────────────
const STANDARDS = [
    { Icon: Shield, title: "Goal Relevance First", copy: "Important directions are considered against your goals, financial position and documented risk preferences. Mutual fund support is provided in a distribution context." },
    { Icon: FileText, title: "Documented Always", copy: "Every conversation, direction, and consent is documented. Our investors always have a written record of what was discussed and decided." },
    { Icon: Eye, title: "Transparent Communication", copy: "We explain in plain language — not jargon. If you do not understand why we are recommending something, we have not done our job." },
    { Icon: Award, title: "Consent-Based Process", copy: "Nothing is executed without your informed consent. Understanding comes before action — always." },
    { Icon: Calendar, title: "Structured Review Cadence", copy: "Reviews can follow a defined schedule agreed for the engagement, supported by progress summaries and documented observations." },
    { Icon: Compass, title: "Goal-Anchored Direction", copy: "Every financial direction is connected to a specific goal from your bucket list. No orphaned investments, no direction without purpose." },
];
function GuidanceStandards() {
    return (<section className="py-28 lg:py-36 bg-[#F4F6F9]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[420px_1fr] gap-14 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>How We Hold Ourselves Accountable</p>
            <h2 className="text-[38px] lg:text-[48px] font-bold text-[#0B0B0F] leading-tight mb-5" style={serif}>
              The Standards We Work By — Every Single Time
            </h2>
            <p className="text-[#6B7280] text-[15px] leading-relaxed mb-8">
              GrowVest's guidance quality is designed to be operational. These are the standards we aim to bring to each agreed client engagement.
            </p>
            <div className="flex items-center gap-3">
              <div className="h-1 rounded-full" style={{ width: "80px", background: `linear-gradient(90deg, ${BLUE}, ${GOLD})` }}/>
              <span className="text-[11px] text-[#6B7280] font-medium">Guidance Standards</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STANDARDS.map(({ Icon, title, copy }) => (<div key={title} className="bg-white p-6 lg:p-7 rounded-3xl border border-gray-100 hover:border-blue-100 hover:-translate-y-0.5 transition-all group" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${BLUE}10` }}>
                  <Icon size={18} style={{ color: BLUE }}/>
                </div>
                <h4 className="font-bold text-[#0B0B0F] text-[15px] mb-2" style={serif}>{title}</h4>
                <p className="text-[#6B7280] text-[13px] leading-relaxed">{copy}</p>
                <div className="mt-4 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}/>
              </div>))}
          </div>
        </div>
      </div>
    </section>);
}
// ─── SECTION 5: REVIEW SYSTEM ─────────────────────────────────────────────────
const REVIEW_ITEMS = [
    { label: "Bucket List Progress", desc: "Goal-by-goal status check — what is on track, ahead, or needs attention." },
    { label: "SIP & Investment Review", desc: "Monthly SIP performance review connected to each goal's funding timeline." },
    { label: "Portfolio Movement", desc: "Portfolio allocation review relative to risk profile and goal proximity." },
    { label: "Insurance Coverage Gap", desc: "Protection coverage check aligned to current income and family responsibilities." },
    { label: "Pending Documentation", desc: "Follow-up on any outstanding documents, forms, or consent requirements." },
    { label: "Next Action Items", desc: "Clear, prioritised next steps for the client and GrowVest team before the next review." },
    { label: "Guide Note", desc: "A concise note summarising observations, open questions and guidance from the review." },
    { label: "Next Review Date", desc: "Confirmed scheduling of the next structured review session." },
];
function ReviewSystem() {
    return (<section className="py-28 lg:py-36 bg-white">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>The Review System</p>
          <h2 className="text-[38px] lg:text-[50px] font-bold text-[#0B0B0F] leading-tight mb-4" style={serif}>
            What Happens in<br />
            <em style={{ fontStyle: "italic", color: BLUE }}>A Structured Progress Review.</em>
          </h2>
          <p className="text-[#6B7280] text-[16px] max-w-[520px] mx-auto leading-relaxed">
            GrowVest's monthly review is not a check-in call. It is a structured, documented review of your entire financial journey — covered eight ways.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_480px] gap-10 items-start">
          {/* Review items list */}
          <div className="space-y-3">
            {REVIEW_ITEMS.map(({ label, desc }, i) => (<div key={label} className="flex gap-5 p-5 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all group cursor-default">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: `${GOLD}15`, color: "#7A5200" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="font-semibold text-[#0B0B0F] text-[14px] mb-0.5 group-hover:text-blue-700 transition-colors" style={serif}>{label}</p>
                  <p className="text-[#6B7280] text-[13px] leading-relaxed">{desc}</p>
                </div>
              </div>))}
          </div>

          {/* Sample review card */}
          <div className="lg:sticky lg:top-24 bg-white rounded-3xl overflow-hidden border border-gray-100" style={{ boxShadow: "0 8px 56px rgba(0,0,0,0.10)" }}>
            {/* Letterhead */}
            <div className="px-7 py-5 border-b border-gray-100" style={{ background: `linear-gradient(135deg, ${BLUE}08, transparent)` }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ background: `linear-gradient(135deg, ${BLUE}, ${GOLD})` }}/>
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: MGRAY }}>GrowVest Guidance</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: `${GOLD}18`, color: "#7A5200" }}>Monthly</span>
              </div>
              <p className="font-bold text-[17px] text-[#0B0B0F]" style={serif}>Bucket List Review — July 2026</p>
              <p className="text-[#6B7280] text-[12px]">Investor: Sample Investor</p>
            </div>

            {/* Progress ring + status */}
            <div className="px-7 py-5 border-b border-gray-100 flex items-center gap-5">
              <svg width="72" height="72" viewBox="0 0 72 72" className="flex-shrink-0">
                <circle cx="36" cy="36" r="28" fill="none" stroke="#E8ECF4" strokeWidth="5"/>
                <circle cx="36" cy="36" r="28" fill="none" stroke={`url(#rev)`} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 28 * 0.65} ${2 * Math.PI * 28 * 0.35}`} transform="rotate(-90 36 36)"/>
                <defs><linearGradient id="rev" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={BLUE}/><stop offset="100%" stopColor={GOLD}/></linearGradient></defs>
                <text x="36" y="40" textAnchor="middle" fontSize="12" fontWeight="700" fill={BLUE}>65%</text>
              </svg>
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase mb-0.5" style={{ color: MGRAY }}>Overall Progress</p>
                <p className="text-[20px] font-bold text-[#0B0B0F]" style={serif}>65% on Track</p>
                <p className="text-[#6B7280] text-[12px]">6 of 9 goals progressing</p>
              </div>
            </div>

            {/* Status rows */}
            {[
            { label: "Monthly SIP", value: "Active", ok: true },
            { label: "Portfolio", value: "Rebalance Needed", ok: false },
            { label: "Insurance Gap", value: "Under Discussion", ok: null },
            { label: "Next Review", value: "15 August 2026", ok: null },
        ].map(({ label, value, ok }) => (<div key={label} className="flex items-center justify-between px-7 py-3.5 border-b border-gray-50 last:border-0">
                <span className="text-[#6B7280] text-[13px]">{label}</span>
                <span className="text-[13px] font-semibold" style={{ color: ok === true ? "#059669" : ok === false ? RED : "#374151" }}>{value}</span>
              </div>))}

            {/* Guide note */}
            <div className="px-7 py-5">
              <div className="p-4 rounded-2xl" style={{ background: `${BLUE}07`, border: `1px solid ${BLUE}15` }}>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: BLUE }}>Guide Note</p>
                <p className="text-[#374151] text-[13px] leading-relaxed italic" style={serif}>
                  "Strong SIP discipline this month. Priority for August: resolve the rebalancing and close the insurance gap conversation."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
// ─── SECTION 6: DELIVERABLES ──────────────────────────────────────────────────
const DELIVERABLES = [
    { Icon: ClipboardList, title: "Investor Assessment Report", when: "Phase 1", copy: "A comprehensive snapshot of your current financial position, goals, and risk profile." },
    { Icon: Map, title: "Bucket List Map", when: "Phase 1", copy: "A visual, structured map of all your life goals — tagged by category, timeline, and priority." },
    { Icon: FileText, title: "Goal-Based Financial Plan", when: "Phase 2", copy: "A complete plan connecting each goal to a specific funding approach, SIP amount, and timeline." },
    { Icon: BarChart3, title: "Monthly Review Report", when: "Phase 3", copy: "A structured monthly document covering SIP, portfolio, insurance, documents, and next actions." },
    { Icon: TrendingUp, title: "Bucket List Progress Report", when: "Phase 3", copy: "A periodic progress report showing how far each life goal has advanced since the plan began." },
    { Icon: Star, title: "Guide Notes & MOMs", when: "Ongoing", copy: "Written notes from important guidance conversations — ensuring continuity, accountability, and clarity." },
];
function Deliverables() {
    return (<section className="py-28 lg:py-36 bg-[#F4F6F9]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>
            What You Receive
          </p>
          <h2 className="text-[38px] lg:text-[50px] font-bold text-[#0B0B0F] leading-tight mb-4" style={serif}>
            Structured Outputs at<br />
            <em style={{ fontStyle: "italic", color: BLUE }}>Every Step of the Journey.</em>
          </h2>
          <p className="text-[#6B7280] text-[16px] max-w-[520px] mx-auto leading-relaxed">
            GrowVest's guidance is designed to be documented, not left only in conversation. Every engagement produces tangible outputs that you own, refer to, and build on.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DELIVERABLES.map(({ Icon, title, when, copy }) => {
            const whenColor = when === "Phase 1" ? BLUE : when === "Phase 2" ? "#7A5200" : when === "Phase 3" ? "#059669" : MGRAY;
            const whenBg = when === "Phase 1" ? `${BLUE}12` : when === "Phase 2" ? `${GOLD}18` : when === "Phase 3" ? "#D1FAE5" : "#E8ECF4";
            return (<div key={title} className="bg-white p-7 rounded-3xl border border-gray-100 hover:border-blue-100 hover:-translate-y-1 transition-all group" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.05)" }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 8px 40px rgba(31,78,216,0.08)`)} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 20px rgba(0,0,0,0.05)")}>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${BLUE}10` }}>
                    <Icon size={20} style={{ color: BLUE }}/>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full" style={{ background: whenBg, color: whenColor }}>{when}</span>
                </div>
                <h4 className="font-bold text-[#0B0B0F] text-[16px] mb-2 leading-snug" style={serif}>{title}</h4>
                <p className="text-[#6B7280] text-[13.5px] leading-relaxed">{copy}</p>
                <div className="mt-5 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}/>
              </div>);
        })}
        </div>
      </div>
    </section>);
}
// ─── SECTION 7: COMPARISON ────────────────────────────────────────────────────
const DIFFS = [
    ["One conversation, then silence", "Continuous monthly reviews and guidance"],
    ["Products presented upfront", "Goals understood before any direction"],
    ["Verbal recommendations only", "Documented plan, MOMs, and progress reports"],
    ["No defined process", "Three-phase structured guidance journey"],
    ["Risk ignored after onboarding", "Risk profile reviewed and referenced always"],
    ["Returns as the primary metric", "Goal progress as the primary metric"],
    ["Investor bears the accountability gap", "GrowVest team documents and follows up agreed steps"],
];
function WayComparison() {
    return (<section className="py-28 lg:py-36 bg-white">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>A Different Standard</p>
          <h2 className="text-[38px] lg:text-[50px] font-bold text-[#0B0B0F] leading-tight" style={serif}>
            The GrowVest Way vs.<br />The Usual Way.
          </h2>
        </div>

        <div className="rounded-3xl overflow-hidden border border-gray-100" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-gray-100">
            <div className="border-b border-gray-100 px-5 py-4 sm:border-b-0 sm:px-8 sm:py-5 bg-[#F4F6F9]">
              <p className="font-bold text-[#6B7280] text-[14px]" style={serif}>The Usual Way</p>
            </div>
            <div className="px-5 py-4 sm:px-8 sm:py-5" style={{ background: `${BLUE}06` }}>
              <p className="font-bold text-[#0B0B0F] text-[14px]" style={serif}>The GrowVest Way</p>
            </div>
          </div>
          {DIFFS.map(([usual, gv], i) => (<div key={i} className="grid grid-cols-1 border-b border-gray-50 last:border-0 sm:grid-cols-2 hover:bg-blue-50/15 transition-colors">
              <div className="flex items-center gap-3 border-b border-gray-100 bg-[#F4F6F9]/30 px-5 py-4 sm:border-b-0 sm:px-8">
                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 text-[9px]">✕</span>
                </div>
                <span className="text-[#9CA3AF] text-[13px]">{usual}</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-4 sm:px-8">
                <Check size={13} style={{ color: BLUE }} className="flex-shrink-0"/>
                <span className="text-[#0B0B0F] text-[13px] font-medium">{gv}</span>
              </div>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── SECTION 8: CTA ───────────────────────────────────────────────────────────
function GrowVestWayCTA() {
    return (<section className="relative py-36 lg:py-52 overflow-hidden" style={{ background: BLACK, ...dotGrid }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 65% 65% at 50% 50%, rgba(31,78,216,0.14) 0%, transparent 70%)`,
        }}/>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-28 pointer-events-none" style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}50)` }}/>

      <div className="max-w-[800px] mx-auto px-5 sm:px-6 lg:px-8 text-center relative">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-10" style={{ background: `${GOLD}40` }}/>
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: GOLD }}>Experience the GrowVest Way</span>
          <div className="h-px w-10" style={{ background: `${GOLD}40` }}/>
        </div>

        <h2 className="text-[48px] lg:text-[68px] font-bold text-white mb-6 leading-[1.04]" style={serif}>
          Begin With a<br />
          <em style={{ fontStyle: "italic", color: GOLD }}>Structured Conversation.</em>
        </h2>

        <p className="text-white/45 text-[17px] leading-relaxed mb-12 max-w-[500px] mx-auto">
          Your first step with GrowVest is simply a conversation — about your life, your goals, and your financial position. No pressure, no product. Just clarity.
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
          {["Goal-Led", "Documented", "Human-Guided"].map((item) => (<div key={item} className="flex items-center gap-2">
              <Check size={12} style={{ color: GOLD }}/>
              <span className="text-white/25 text-[12px]">{item}</span>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function TheGrowVestWay() {
    return (<>
      <Hero />
      <Philosophy />
      <ThreePhases />
      <GuidanceStandards />
      <ReviewSystem />
      <Deliverables />
      <WayComparison />
      <GrowVestWayCTA />
    </>);
}
