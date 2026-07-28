"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Home as HomeIcon, Star, Shield, Plane, Wallet, TrendingUp, Globe, FileText, BarChart3, Users, Map, RefreshCw, ChevronDown, Check, } from "lucide-react";
import { BLUE, BLACK, GOLD, GRAY, MGRAY, RED, serif, dotGrid } from "../lib/brand";
// ─── DATA ─────────────────────────────────────────────────────────────────────
const tagStyles = {
    Protect: { background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30` },
    Transform: { background: `${GOLD}18`, color: "#7A5200", border: `1px solid ${GOLD}40` },
    Review: { background: "#E8ECF4", color: MGRAY, border: "1px solid #D1D5DB" },
};
const lightTagStyles = {
    Protect: { background: `${BLUE}12`, color: BLUE, border: `1px solid ${BLUE}25` },
    Transform: { background: `${GOLD}15`, color: "#7A5200", border: `1px solid ${GOLD}35` },
    Review: { background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.15)" },
};
const GOALS = [
    {
        Icon: GraduationCap,
        label: "Child Education",
        tagline: "Protect your child's future with planned financial clarity.",
        tag: "Protect",
        color: GOLD,
        whatWeDo: "We map the education milestone, estimate the required corpus, identify the funding gap, and build a structured SIP-based plan tied to the timeline.",
        timeline: "5 – 18 years",
        whyMatters: "Education costs rise faster than inflation. Starting early is the single greatest advantage you can give your child.",
    },
    {
        Icon: HomeIcon,
        label: "Dream Home",
        tagline: "Transform a dream into a structured, achievable goal.",
        tag: "Transform",
        color: BLUE,
        whatWeDo: "We analyse your income, liabilities, and savings rate, then create a home acquisition roadmap that balances EMIs, emergency funds, and long-term goals.",
        timeline: "3 – 10 years",
        whyMatters: "A home is often the largest financial decision of a lifetime. Structured planning prevents it from derailing every other goal.",
    },
    {
        Icon: Star,
        label: "Retirement",
        tagline: "Build confidence for a dignified and independent future.",
        tag: "Transform",
        color: "#8B5CF6",
        whatWeDo: "We calculate your retirement corpus based on current lifestyle, inflation, and expected retirement age, then design a long-term investment direction aligned to your risk profile.",
        timeline: "15 – 35 years",
        whyMatters: "Retirement is the longest financial goal most people have. Every year of delay significantly increases the required monthly savings.",
    },
    {
        Icon: Shield,
        label: "Family Protection",
        tagline: "Secure the people who depend on you most.",
        tag: "Protect",
        color: RED,
        whatWeDo: "We help organise your existing protection information, identify questions around liabilities and income replacement, and highlight areas that may need review by an appropriately licensed insurance professional.",
        timeline: "Immediate",
        whyMatters: "Protection is not optional — it is the foundation that all other financial goals rest on. Without it, every plan is at risk.",
    },
    {
        Icon: Plane,
        label: "Travel & Experiences",
        tagline: "Plan for memories with financial intention and clarity.",
        tag: "Transform",
        color: "#EC4899",
        whatWeDo: "We carve out a dedicated bucket list fund with a clear annual or milestone-based accumulation strategy so experiences are planned, not impulsive.",
        timeline: "1 – 5 years",
        whyMatters: "Unplanned travel spending is one of the leading causes of SIP disruption. A dedicated goal fund protects both the experience and the broader plan.",
    },
    {
        Icon: Wallet,
        label: "Emergency Fund",
        tagline: "Stay ready for life's uncertainties without disruption.",
        tag: "Protect",
        color: "#14B8A6",
        whatWeDo: "We calculate the ideal emergency corpus based on your monthly expenses and liabilities, then help you build and park it in the right liquid instrument.",
        timeline: "6 – 18 months",
        whyMatters: "An emergency fund is what prevents an unexpected event from becoming a financial crisis. It is the most important first step for every investor.",
    },
    {
        Icon: TrendingUp,
        label: "Loan Closure",
        tagline: "Move toward freedom and financial breathing space.",
        tag: "Review",
        color: BLUE,
        whatWeDo: "We review your current liabilities, prioritise high-cost debt, and build a structured prepayment plan that balances loan closure with ongoing goal-based investing.",
        timeline: "2 – 7 years",
        whyMatters: "Carrying expensive debt reduces your wealth-building capacity every month. Structured loan closure releases cash flow for goals that matter.",
    },
    {
        Icon: Globe,
        label: "Legacy Planning",
        tagline: "Shape your wealth beyond today for those you love.",
        tag: "Transform",
        color: "#F97316",
        whatWeDo: "We help structure your wealth intent — from nominee updates and will documentation to wealth transfer alignment — so your legacy is clear and protected.",
        timeline: "Ongoing",
        whyMatters: "Legacy is not just about wealth — it is about clarity and intention. Without a plan, even well-built wealth can create conflict rather than care.",
    },
    {
        Icon: FileText,
        label: "Tax Planning",
        tagline: "Bring clarity and structure to important financial decisions.",
        tag: "Review",
        color: "#10B981",
        whatWeDo: "We help organise relevant records and questions so you can coordinate efficiently with your qualified tax professional. GrowVest does not provide tax or legal advice.",
        timeline: "Annual",
        whyMatters: "Every rupee saved in tax is a rupee that compounds in your favour. Coordinated tax planning is an often-missed wealth multiplier.",
    },
    {
        Icon: BarChart3,
        label: "Wealth Growth",
        tagline: "Grow with discipline, purpose, and regular review.",
        tag: "Review",
        color: GOLD,
        whatWeDo: "We build a diversified, risk-appropriate investment direction connected to your overall goal roadmap, reviewed monthly to stay aligned with your priorities.",
        timeline: "Ongoing",
        whyMatters: "Wealth without direction is noise. Structured, goal-linked wealth management turns markets into tools — not distractions.",
    },
];
const CATEGORIES = [
    {
        tag: "Protect",
        heading: "Protect What Matters",
        copy: "These goals secure the foundation — protecting your family, income, and savings from life's uncertainties.",
        goals: GOALS.filter((g) => g.tag === "Protect"),
    },
    {
        tag: "Transform",
        heading: "Transform What Is Possible",
        copy: "These goals turn your life aspirations into structured financial milestones — from a dream home to a dignified retirement.",
        goals: GOALS.filter((g) => g.tag === "Transform"),
    },
    {
        tag: "Review",
        heading: "Review and Stay on Track",
        copy: "These goals require regular monitoring, adjustment, and coordination to stay aligned with your financial direction.",
        goals: GOALS.filter((g) => g.tag === "Review"),
    },
];
// ─── SECTION 1: HERO ──────────────────────────────────────────────────────────
function GoalsHero() {
    return (<section className="relative min-h-[85vh] flex items-center overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `
            radial-gradient(ellipse 55% 65% at 20% 55%, rgba(31,78,216,0.20) 0%, transparent 65%),
            radial-gradient(ellipse 35% 40% at 80% 25%, rgba(245,179,1,0.08) 0%, transparent 65%)
          `,
        }}/>

      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 w-full py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_440px] gap-14 items-center">

          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: GOLD }}/>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
                Your Bucket List Goals
              </span>
            </div>

            <h1 className="text-[54px] xl:text-[68px] font-bold text-white mb-7 leading-[1.05]" style={serif}>
              Map What Matters.<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>Build What Lasts.</em>
            </h1>

            <p className="text-white/50 text-[17px] leading-relaxed mb-5 max-w-[520px]">
              Before any financial direction, GrowVest starts with your life — your responsibilities, your dreams, and your family priorities. Every goal you map becomes a structured wealth milestone.
            </p>

            <p className="text-white/30 text-[14px] leading-relaxed mb-10 max-w-[460px]">
              We do not begin with products. We begin with your bucket list.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#explore-goals" className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 lg:px-8 py-4 rounded-full text-white font-semibold text-[15px] transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: BLUE, boxShadow: `0 8px 32px ${BLUE}50` }}>
                Explore Your Goals <ArrowRight size={17}/>
              </a>
              <Link href="/" className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 lg:px-8 py-4 rounded-full font-semibold text-[15px] border transition-all hover:bg-white/5" style={{ borderColor: `${GOLD}45`, color: GOLD }}>
                Back to Home
              </Link>
            </div>
          </div>

          {/* Right: 3 category pillars */}
          <div className="space-y-3">
            {CATEGORIES.map(({ tag, heading, goals }) => (<div key={tag} className="flex items-center gap-5 p-5 rounded-2xl border transition-all hover:-translate-y-0.5 group" style={{
                background: "rgba(255,255,255,0.055)",
                backdropFilter: "blur(16px)",
                borderColor: "rgba(255,255,255,0.10)",
            }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${GOLD}50`)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)")}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[13px] font-bold" style={{ background: lightTagStyles[tag].background, color: tag === "Review" ? GOLD : lightTagStyles[tag].color }}>
                  {goals.length}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-[14px] mb-1" style={serif}>{heading}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {goals.slice(0, 3).map((g) => (<span key={g.label} className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{g.label}</span>))}
                    {goals.length > 3 && (<span className="text-[10px] text-white/30 px-1">+{goals.length - 3} more</span>)}
                  </div>
                </div>
                <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full flex-shrink-0" style={lightTagStyles[tag]}>
                  {tag}
                </span>
              </div>))}

            {/* Total count */}
            <div className="flex items-center gap-3 pt-3 pl-2">
              <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${GOLD}30, transparent)` }}/>
              <span className="text-white/20 text-[12px]">{GOALS.length} life goals mapped</span>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
// ─── SECTION 2: CATEGORY STRIPS ───────────────────────────────────────────────
function GoalCategories() {
    return (<section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>
            Goal Framework
          </p>
          <h2 className="text-[38px] lg:text-[50px] font-bold text-[#0B0B0F] leading-tight mb-4" style={serif}>
            Every Goal Has a Purpose.<br />
            <em style={{ fontStyle: "italic", color: BLUE }}>Every Purpose Has a Plan.</em>
          </h2>
          <p className="text-[#6B7280] text-[16px] max-w-[520px] mx-auto leading-relaxed">
            GrowVest organises your goals into three clear categories — so your wealth strategy is never scattered.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {CATEGORIES.map(({ tag, heading, copy, goals }) => {
            const borderColor = tag === "Protect" ? BLUE : tag === "Transform" ? GOLD : "#D1D5DB";
            return (<div key={tag} className="rounded-3xl p-8 border-t-4 hover:-translate-y-1 transition-all group" style={{
                    background: GRAY,
                    borderTopColor: borderColor,
                    boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
                }}>
                {/* Tag */}
                <span className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-5" style={tagStyles[tag]}>
                  {tag}
                </span>

                <h3 className="text-[22px] font-bold mb-3 leading-snug" style={{ ...serif, color: "#0B0B0F" }}>
                  {heading}
                </h3>
                <p className="text-[#6B7280] text-[14px] leading-relaxed mb-7">{copy}</p>

                <ul className="space-y-2.5">
                  {goals.map(({ Icon, label }) => (<li key={label} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${borderColor}12` }}>
                        <Icon size={13} style={{ color: borderColor }}/>
                      </div>
                      <span className="text-[13.5px] text-[#374151]">{label}</span>
                    </li>))}
                </ul>

                {/* Hover gold line */}
                <div className="mt-7 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}/>
              </div>);
        })}
        </div>
      </div>
    </section>);
}
// ─── SECTION 3: GOAL EXPLORER ─────────────────────────────────────────────────
function GoalExplorer() {
    const [activeGoal, setActiveGoal] = useState(null);
    return (<section id="explore-goals" className="py-28 lg:py-36 relative overflow-hidden" style={{ background: BLACK, ...dotGrid }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 60% 55% at 50% 50%, rgba(31,78,216,0.10) 0%, transparent 70%)`,
        }}/>

      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: GOLD }}>
            Explore Goals
          </p>
          <h2 className="text-[38px] lg:text-[50px] font-bold text-white leading-tight mb-4" style={serif}>
            Your Bucket List,<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>Fully Mapped.</em>
          </h2>
          <p className="text-white/40 text-[15px] max-w-[500px] mx-auto leading-relaxed">
            Select any goal to see what GrowVest does for it, why it matters, and how we bring structure to it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {GOALS.map((goal) => {
            const { Icon, label, tagline, tag, color, whatWeDo, timeline, whyMatters } = goal;
            const isOpen = activeGoal === label;
            return (<div key={label} role="button" tabIndex={0} aria-expanded={isOpen} className="rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300" style={{
                    background: isOpen ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                    borderColor: isOpen ? `${GOLD}55` : "rgba(255,255,255,0.08)",
                    boxShadow: isOpen ? `0 8px 40px rgba(0,0,0,0.35)` : "none",
                }} onClick={() => setActiveGoal(isOpen ? null : label)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveGoal(isOpen ? null : label); } }}>
                {/* Card header — always visible */}
                <div className="flex items-center gap-4 p-5">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform" style={{
                    background: `${color}22`,
                    transform: isOpen ? "scale(1.1)" : "scale(1)",
                }}>
                    <Icon size={18} style={{ color }}/>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-white font-semibold text-[15px]" style={serif}>{label}</p>
                      <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={lightTagStyles[tag]}>
                        {tag}
                      </span>
                    </div>
                    <p className="text-white/40 text-[12.5px] leading-snug truncate">{tagline}</p>
                  </div>

                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all" style={{ background: isOpen ? `${GOLD}20` : "rgba(255,255,255,0.06)" }}>
                    <ChevronDown size={14} className="transition-transform duration-300" style={{ color: isOpen ? GOLD : "rgba(255,255,255,0.35)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}/>
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && (<div className="px-5 pb-6 border-t border-white/6">
                    <div className="pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* What we do */}
                      <div className="sm:col-span-2">
                        <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: GOLD }}>
                          What GrowVest Does
                        </p>
                        <p className="text-white/65 text-[13.5px] leading-relaxed">{whatWeDo}</p>
                      </div>

                      {/* Meta */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                            Typical Timeline
                          </p>
                          <p className="text-white font-semibold text-[14px]" style={serif}>{timeline}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                            Tag
                          </p>
                          <span className="inline-block text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full" style={lightTagStyles[tag]}>
                            {tag}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Why it matters */}
                    <div className="mt-5 p-4 rounded-2xl" style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}20` }}>
                      <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: BLUE }}>
                        Why This Matters
                      </p>
                      <p className="text-white/55 text-[13px] leading-relaxed italic" style={serif}>"{whyMatters}"</p>
                    </div>
                  </div>)}
              </div>);
        })}
        </div>

        {/* Prompt */}
        <div className="text-center mt-12">
          <p className="text-white/20 text-[13px] mb-5">
            Ready to map these goals to your financial roadmap?
          </p>
          <Link href="/contact" className="gv-btn-primary inline-flex items-center gap-2.5 px-5 sm:px-6 lg:px-8 py-4 rounded-full text-white font-semibold text-[15px] transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: BLUE, boxShadow: `0 8px 32px ${BLUE}50` }}>
            Begin Your Journey <ArrowRight size={17}/>
          </Link>
        </div>
      </div>
    </section>);
}
// ─── SECTION 4: GOAL MAPPING JOURNEY ─────────────────────────────────────────
const MAPPING_STEPS = [
    { Icon: Users, step: "01", title: "Discovery Conversation", copy: "We start with a structured conversation about your life — your family, responsibilities, income, and aspirations. No forms, no product pitch." },
    { Icon: BarChart3, step: "02", title: "Investor Assessment", copy: "We assess your financial position, existing assets, liabilities, risk profile, and investment behaviour to understand where you stand today." },
    { Icon: Map, step: "03", title: "Bucket List Mapping", copy: "Together, we map your goals across Protect, Transform, and Review — assigning timelines, priorities, and estimated financial gaps to each." },
    { Icon: RefreshCw, step: "04", title: "Risk Profile Review", copy: "We align your mapped goals with your risk comfort and investment horizon, ensuring every direction is suitable, sustainable, and structured." },
];
function GoalMappingJourney() {
    return (<section className="py-28 lg:py-36 bg-[#F4F6F9]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[420px_1fr] gap-14 lg:gap-20 items-start">

          {/* Left sticky */}
          <div className="lg:sticky lg:top-24">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>
              How It Works
            </p>
            <h2 className="text-[38px] lg:text-[48px] font-bold text-[#0B0B0F] leading-tight mb-5" style={serif}>
              From Conversation to Clarity in Four Steps
            </h2>
            <p className="text-[#6B7280] text-[15px] leading-relaxed mb-8">
              Goal mapping is not a form-filling exercise. It is a guided conversation that turns your life priorities into a structured financial direction.
            </p>

            {/* Gold advisory line */}
            <div className="flex items-center gap-3">
              <div className="h-1 rounded-full" style={{ width: "80px", background: `linear-gradient(90deg, ${BLUE}, ${GOLD})` }}/>
              <span className="text-[11px] text-[#6B7280] font-medium">GrowVest Guidance Process</span>
            </div>
          </div>

          {/* Right: 4 steps */}
          <div className="space-y-5">
            {MAPPING_STEPS.map(({ Icon, step, title, copy }) => (<div key={step} className="flex gap-6 p-6 lg:p-8 bg-white rounded-3xl border border-gray-100 hover:border-blue-100 hover:-translate-y-0.5 transition-all group" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                {/* Step number */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${BLUE}12` }}>
                    <Icon size={18} style={{ color: BLUE }}/>
                  </div>
                  <span className="text-[11px] font-bold tabular-nums" style={{ color: `${GOLD}80` }}>{step}</span>
                </div>

                <div>
                  <h4 className="text-[18px] font-bold text-[#0B0B0F] mb-2 group-hover:text-blue-700 transition-colors" style={serif}>
                    {title}
                  </h4>
                  <p className="text-[#6B7280] text-[14px] leading-relaxed">{copy}</p>
                </div>
              </div>))}
          </div>
        </div>
      </div>
    </section>);
}
// ─── SECTION 5: WHY GOALS COME FIRST ─────────────────────────────────────────
const BELIEF_POINTS = [
    { heading: "Goals give money a purpose.", copy: "Without a goal attached to it, every rupee saved is just a number. Goals transform savings into intention." },
    { heading: "Goals reveal the gap.", copy: "The financial gap between where you are and where you want to be is the most important number in your wealth journey." },
    { heading: "Goals create accountability.", copy: "A mapped goal becomes a trackable milestone. Monthly reviews only make sense when there is something to review against." },
];
function WhyGoalsFirst() {
    return (<section className="py-28 lg:py-40 bg-white">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 lg:px-8">
        {/* Editorial headline */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px w-12" style={{ background: `linear-gradient(90deg, transparent, ${BLUE}40)` }}/>
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: MGRAY }}>Why We Start Here</p>
          </div>

          <h2 className="text-[46px] lg:text-[62px] xl:text-[72px] font-bold text-[#0B0B0F] leading-[1.06] mb-8" style={serif}>
            A Financial Plan Without<br />Goals Is Just a{" "}
            <span className="relative inline-block" style={{ color: BLUE }}>
              Guess.
              <span className="absolute left-0 right-0 block rounded-full" style={{ bottom: "-4px", height: "4px", background: GOLD }}/>
            </span>
          </h2>

          <p className="text-[#6B7280] text-[18px] leading-relaxed max-w-[680px]">
            GrowVest starts with your bucket list because life goals are the only honest starting point for any financial direction. Everything else — products, returns, markets — should follow from there.
          </p>
        </div>

        {/* Belief points */}
        <div className="grid lg:grid-cols-3 gap-6">
          {BELIEF_POINTS.map(({ heading, copy }, i) => (<div key={heading} className="p-7 rounded-3xl border border-gray-100 hover:-translate-y-1 transition-all group" style={{ background: GRAY, boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 8px 32px rgba(31,78,216,0.08)`)} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)")}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: BLUE }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${BLUE}20, transparent)` }}/>
              </div>
              <h4 className="text-[17px] font-bold text-[#0B0B0F] mb-3 leading-snug" style={serif}>{heading}</h4>
              <p className="text-[#6B7280] text-[14px] leading-relaxed">{copy}</p>
              <div className="mt-5 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}/>
            </div>))}
        </div>

        {/* Evidence strip */}
        <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-gray-100 pt-10">
          {[
            { value: "10+", label: "Goal Types Mapped" },
            { value: "3", label: "Clarity Categories" },
            { value: "100%", label: "Goal-Led Planning" },
        ].map(({ value, label }) => (<div key={label} className="flex items-baseline gap-3">
              <span className="text-[36px] font-bold" style={{ ...serif, color: BLUE }}>{value}</span>
              <span className="text-[#6B7280] text-[14px]">{label}</span>
              <div className="h-px w-8 ml-2" style={{ background: `${GOLD}40` }}/>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── SECTION 6: WHAT INVESTORS SAY ───────────────────────────────────────────
const TESTIMONIALS = [
    {
        quote: "For the first time, I understood which goals needed which money, and when. GrowVest made it simple.",
        name: "Priya Mehta",
        role: "Software Engineer · Mumbai",
        tag: "Family Protection + Child Education",
    },
    {
        quote: "I had investments across different places. A goal map helped me see the bigger picture.",
        name: "Rajan Sharma",
        role: "Business Owner · Pune",
        tag: "Retirement + Wealth Growth",
    },
    {
        quote: "The goal mapping session was the most honest financial conversation I have ever had.",
        name: "Deepika Nair",
        role: "Doctor · Bengaluru",
        tag: "Dream Home + Tax Planning",
    },
];
function InvestorVoices() {
    return (<section className="py-24 lg:py-32 bg-[#F4F6F9]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>
            Investor Voices
          </p>
          <h2 className="text-[36px] lg:text-[46px] font-bold text-[#0B0B0F] leading-tight" style={serif}>
            What Investors Say<br />After Mapping Their Goals.
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quote, name, role, tag }) => (<div key={name} className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-100 hover:-translate-y-1 transition-all" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.05)" }}>
              {/* Quote mark */}
              <div className="text-[48px] font-bold leading-none mb-4" style={{ ...serif, color: `${GOLD}40`, lineHeight: 1 }}>&ldquo;</div>
              <p className="text-[#374151] text-[15px] leading-relaxed mb-6 italic" style={serif}>{quote}</p>

              <div className="border-t border-gray-100 pt-5 flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-[14px] text-[#0B0B0F]">{name}</p>
                  <p className="text-[#9CA3AF] text-[12px] mt-0.5">{role}</p>
                </div>
                <span className="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: `${BLUE}10`, color: BLUE, border: `1px solid ${BLUE}20` }}>
                  {tag}
                </span>
              </div>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── SECTION 7: FINAL CTA ─────────────────────────────────────────────────────
const ctaBgGoals = ["Child Education", "Dream Home", "Retirement", "Family Protection", "Wealth Growth", "Legacy Planning", "Emergency Fund", "Tax Planning"];
function GoalsCTA() {
    return (<section className="relative py-36 lg:py-52 overflow-hidden" style={{ background: BLACK, ...dotGrid }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 65% 65% at 50% 50%, rgba(31,78,216,0.14) 0%, transparent 70%)` }}/>

      {/* Floating background goal labels */}
      {ctaBgGoals.map((goal, i) => (<div key={goal} className="absolute pointer-events-none select-none" style={{
                color: "rgba(255,255,255,0.05)",
                top: `${10 + (i * 11) % 78}%`,
                left: `${3 + (i * 14) % 92}%`,
                transform: `rotate(${-10 + (i * 6) % 20}deg)`,
                fontFamily: "'Libre Baskerville', serif",
                fontSize: "13px",
            }}>
          {goal}
        </div>))}

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none" style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}50)` }}/>

      <div className="max-w-[800px] mx-auto px-5 sm:px-6 lg:px-8 text-center relative">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-10" style={{ background: `${GOLD}40` }}/>
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: GOLD }}>
            Begin Your Journey
          </span>
          <div className="h-px w-10" style={{ background: `${GOLD}40` }}/>
        </div>

        <h2 className="text-[48px] lg:text-[68px] font-bold text-white mb-6 leading-[1.04]" style={serif}>
          Your Goals Are<br />
          <em style={{ fontStyle: "italic", color: GOLD }}>Waiting to Be Mapped.</em>
        </h2>

        <p className="text-white/45 text-[17px] leading-relaxed mb-12 max-w-[500px] mx-auto">
          A single conversation with GrowVest can turn a scattered list of aspirations into a clear, structured wealth roadmap.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="gv-btn-primary inline-flex items-center gap-3 px-10 py-5 rounded-full text-white font-semibold text-[16px] transition-all hover:opacity-90 hover:-translate-y-1" style={{ background: BLUE, boxShadow: `0 12px 40px ${BLUE}55` }}>
            Begin Your Journey <ArrowRight size={19}/>
          </Link>
          <Link href="/bucket-list-builder" data-analytics-event="secondary_cta_click" data-analytics-location="page_final_cta" className="gv-btn-secondary gv-btn-secondary--dark inline-flex items-center gap-2">
            Explore Your Goals
          </Link>
        </div>

        {/* Trust note */}
        <div className="flex items-center justify-center gap-5 mt-12">
          {["Goal-Led Guidance", "Risk-Aware Planning", "No Product Pitch"].map((item) => (<div key={item} className="flex items-center gap-2">
              <Check size={12} style={{ color: GOLD }}/>
              <span className="text-white/25 text-[12px]">{item}</span>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── YOUR GOALS PAGE ──────────────────────────────────────────────────────────
export default function YourGoals() {
    return (<>
      <GoalsHero />
      <GoalCategories />
      <GoalExplorer />
      <GoalMappingJourney />
      <WhyGoalsFirst />
      <InvestorVoices />
      <GoalsCTA />
    </>);
}
