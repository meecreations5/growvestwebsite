"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Shield, TrendingUp, Target, Star, GraduationCap, Globe, FileText, BarChart3, Eye, Users, RefreshCw, ChevronRight, AlertCircle, Calendar, Wallet, } from "lucide-react";
import { BLUE, BLACK, GOLD, WHITE, GRAY, MGRAY, RED, serif, dotGrid } from "../lib/brand";
// ─── DATA ─────────────────────────────────────────────────────────────────────
const tagStyles = {
    Protect: { background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30` },
    Transform: { background: `${GOLD}18`, color: "#7A5200", border: `1px solid ${GOLD}40` },
    Review: { background: "#E8ECF4", color: MGRAY, border: "1px solid #D1D5DB" },
};
const darkTagStyles = {
    Protect: { background: `${BLUE}20`, color: "#93B4FF" },
    Transform: { background: `${GOLD}20`, color: GOLD },
    Review: { background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.55)" },
};
const SERVICES = [
    {
        id: "goal-based",
        Icon: Target,
        title: "Goal-Based Investment Planning",
        tag: "Protect",
        color: BLUE,
        tagline: "Every investment anchored to a life goal — not a product shelf.",
        what: "GrowVest helps organise your financial goals, timelines, target amounts and current investments so the purpose behind each financial decision is easier to understand.",
        howItWorks: [
            "Map your goals across Protect, Transform, and Review categories",
            "Assign a target corpus and timeline to each goal",
            "Design a goal-wise SIP and investment direction",
            "Review goal-wise progress monthly and adjust as needed",
        ],
        whoFor: "All investors starting a structured financial journey",
        goalLink: "Child Education, Retirement, Dream Home, Legacy Planning",
        receive: "Goal-Based Financial Plan + Goal-Wise SIP Schedule",
    },
    {
        id: "sip-mf",
        Icon: TrendingUp,
        title: "SIP & Mutual Fund Guidance",
        tag: "Transform",
        color: GOLD,
        tagline: "Structured SIP discipline connected to each goal — not scattered across funds.",
        what: "GrowVest ensures your SIP investments are intentional — each SIP tied to a specific goal, appropriate to your risk profile, and reviewed regularly for relevance and performance.",
        howItWorks: [
            "Assess your current SIP structure and goal alignment",
            "Illustrate a goal-linked contribution schedule by category",
            "Guide fund selection based on risk profile and horizon",
            "Review contribution progress against goal assumptions",
        ],
        whoFor: "Investors with existing SIPs or starting systematic investing",
        goalLink: "All bucket list goals with 3+ year horizons",
        receive: "SIP Schedule + Monthly SIP Review Report",
    },
    {
        id: "portfolio",
        Icon: BarChart3,
        title: "Portfolio Review",
        tag: "Review",
        color: "#8B5CF6",
        tagline: "Your portfolio reviewed not against a benchmark — but against your goals.",
        what: "GrowVest can help organise portfolio information against goals, timelines and documented risk preferences, while regulated portfolio advice should come from an appropriately registered professional.",
        howItWorks: [
            "Full portfolio mapping against all active goals",
            "Risk profile alignment review across all holdings",
            "Identify allocation questions that may need registered professional review",
            "Portfolio health scorecard with action items",
        ],
        whoFor: "Investors with existing portfolios or multiple investments",
        goalLink: "Retirement, Wealth Growth, Legacy Planning",
        receive: "Portfolio Information Summary + Review Questions",
    },
    {
        id: "insurance",
        Icon: Shield,
        title: "Insurance Planning",
        tag: "Protect",
        color: RED,
        tagline: "Protection planning that secures the people and goals that depend on you.",
        what: "GrowVest helps organise existing protection information, liabilities and family responsibilities to identify questions that may require review by an appropriately licensed insurance professional.",
        howItWorks: [
            "Review existing life and health insurance coverage",
            "Calculate income replacement need based on responsibilities",
            "Identify coverage gaps relative to goal commitments",
            "Document protection questions for a licensed insurance professional",
        ],
        whoFor: "All investors with family responsibilities and income dependants",
        goalLink: "Family Protection, Child Education, Retirement",
        receive: "Protection Information Summary + Review Questions",
    },
    {
        id: "retirement",
        Icon: Star,
        title: "Retirement Planning",
        tag: "Transform",
        color: "#10B981",
        tagline: "Build the corpus for a dignified, independent retirement — with structured discipline.",
        what: "GrowVest calculates your retirement corpus requirement based on your current lifestyle, inflation expectations, and expected retirement age — then designs a long-term direction aligned to your risk profile and timeline.",
        howItWorks: [
            "Calculate retirement corpus based on lifestyle and inflation",
            "Assess current savings rate vs required retirement funding",
            "Design a long-term, risk-appropriate investment direction",
            "Track retirement assumptions through scheduled progress reviews",
        ],
        whoFor: "Working investors at any stage — early career to pre-retirement",
        goalLink: "Retirement (primary), Legacy Planning (secondary)",
        receive: "Retirement Corpus Plan + Progress Tracking Report",
    },
    {
        id: "education",
        Icon: GraduationCap,
        title: "Child Education Planning",
        tag: "Protect",
        color: GOLD,
        tagline: "A dedicated plan that protects your child's future before inflation does.",
        what: "GrowVest builds a dedicated education corpus plan for your child — estimating future education costs, identifying the monthly savings required, and designing a structured investment direction with the right timeline.",
        howItWorks: [
            "Estimate future education cost with inflation adjustment",
            "Calculate monthly funding requirement based on child's age",
            "Design a dedicated education-goal SIP and investment plan",
            "Review education fund progress annually and at milestones",
        ],
        whoFor: "Parents with children aged 0–15 years",
        goalLink: "Child Education (primary)",
        receive: "Education Corpus Plan + Dedicated SIP Schedule",
    },
    {
        id: "loan",
        Icon: Wallet,
        title: "Loan Planning Support",
        tag: "Review",
        color: BLUE,
        tagline: "Move toward financial freedom by bringing structure to debt management.",
        what: "GrowVest reviews your current liabilities, prioritises high-cost debt, and helps you build a structured repayment plan — balancing loan closure with ongoing goal-based investing to maximise your financial breathing space.",
        howItWorks: [
            "Review all existing loans, EMIs, and interest rates",
            "Prioritise debt repayment by cost and impact on cash flow",
            "Design a structured prepayment plan alongside goal SIPs",
            "Track loan closure progress and review at milestones",
        ],
        whoFor: "Investors with home loans, personal loans, or multiple EMIs",
        goalLink: "Loan Closure, Emergency Fund, Wealth Growth",
        receive: "Loan Repayment Plan + Cash Flow Review",
    },
    {
        id: "cibil",
        Icon: Eye,
        title: "CIBIL / Credit Health Guidance",
        tag: "Review",
        color: "#6366F1",
        tagline: "Your credit health is part of your financial health — reviewed and guided.",
        what: "GrowVest incorporates your credit health into the overall financial picture — reviewing your CIBIL score, identifying factors affecting it, and providing structured guidance to improve or maintain it over time.",
        howItWorks: [
            "Review current CIBIL score and key influencing factors",
            "Identify credit behaviour patterns affecting the score",
            "Provide guidance on improving credit health over time",
            "Monitor credit health annually as part of holistic review",
        ],
        whoFor: "Investors planning major financial decisions or loan applications",
        goalLink: "Loan Closure, Dream Home, Emergency Fund",
        receive: "Credit Health Summary + Improvement Action Plan",
    },
    {
        id: "tax",
        Icon: FileText,
        title: "Tax & Accounting Coordination",
        tag: "Review",
        color: "#10B981",
        tagline: "Tax efficiency as a wealth multiplier — coordinated, not afterthought.",
        what: "GrowVest can help organise documents and planning questions for discussion with your qualified tax professional. GrowVest does not provide tax or legal advice.",
        howItWorks: [
            "Review current tax planning and deduction utilisation",
            "Coordinate investment direction with tax efficiency goals",
            "Ensure documentation is complete for all deductions",
            "Annual tax review aligned to financial plan and goals",
        ],
        whoFor: "All investors, especially those with salaried or business income",
        goalLink: "Tax Planning, Wealth Growth",
        receive: "Tax Coordination Summary + Documentation Checklist",
    },
    {
        id: "diversification",
        Icon: Globe,
        title: "Wealth Diversification Review",
        tag: "Transform",
        color: "#F97316",
        tagline: "Spread wisely — across goals, risk levels, and time horizons.",
        what: "GrowVest reviews your overall wealth allocation across asset classes, goals, and risk levels — identifying over-concentration, under-represented areas, and opportunities to spread wealth more effectively for long-term stability.",
        howItWorks: [
            "Map current wealth across asset classes and goal categories",
            "Identify over-concentration and under-diversified areas",
            "Identify diversification questions for registered professional review",
            "Track diversification health as part of portfolio reviews",
        ],
        whoFor: "Investors with multiple assets or wealth above ₹25L",
        goalLink: "Wealth Growth, Legacy Planning, Retirement",
        receive: "Wealth Information Map + Diversification Questions",
    },
];
// ─── SECTION 1: HERO ──────────────────────────────────────────────────────────
function Hero() {
    return (<section className="relative min-h-[85vh] flex items-center overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `
          radial-gradient(ellipse 55% 65% at 18% 55%, rgba(31,78,216,0.18) 0%, transparent 65%),
          radial-gradient(ellipse 30% 40% at 80% 20%, rgba(245,179,1,0.07) 0%, transparent 60%)
        `,
        }}/>

      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 w-full py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_440px] gap-14 items-center">

          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: GOLD }}/>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>Wealth Guidance</span>
            </div>
            <h1 className="text-[54px] xl:text-[68px] font-bold text-white mb-7 leading-[1.04]" style={serif}>
              Guidance That Protects.<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>Planning That Transforms.</em>
            </h1>
            <p className="text-white/50 text-[17px] leading-relaxed mb-5 max-w-[520px]">
              GrowVest supports investors across ten areas of wealth guidance — from goal mapping and protection questions to tax coordination and portfolio information review — always anchored to life goals and suitability.
            </p>
            <p className="text-white/28 text-[14px] leading-relaxed mb-10 max-w-[460px]">
              No product pushing. No return promises. Every direction begins with your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#services" className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 lg:px-8 py-4 rounded-full text-white font-semibold text-[15px] transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: BLUE, boxShadow: `0 8px 32px ${BLUE}50` }}>
                Explore Guidance Areas <ArrowRight size={17}/>
              </a>
              <Link href="/your-goals" className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 lg:px-8 py-4 rounded-full font-semibold text-[15px] border transition-all hover:bg-white/5" style={{ borderColor: `${GOLD}45`, color: GOLD }}>
                Map Your Goals First
              </Link>
            </div>
          </div>

          {/* Right: category summary */}
          <div className="space-y-3">
            {[
            { tag: "Protect", count: 3, label: "Protection-First Planning", items: "Goal-Based Planning · Insurance · Child Education", Icon: Shield },
            { tag: "Transform", count: 4, label: "Transformation Planning", items: "SIP Guidance · Retirement · Diversification · More", Icon: TrendingUp },
            { tag: "Review", count: 3, label: "Ongoing Review & Guidance", items: "Portfolio · Tax · Loan · CIBIL", Icon: RefreshCw },
        ].map(({ tag, count, label, items, Icon }) => (<a href="#services" key={tag} className="flex items-center gap-5 p-5 rounded-2xl border transition-all hover:-translate-y-0.5 group block cursor-pointer" style={{ background: "rgba(255,255,255,0.055)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.10)" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${GOLD}50`)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)")}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ background: darkTagStyles[tag].background }}>
                  <Icon size={17} style={{ color: darkTagStyles[tag].color }}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={darkTagStyles[tag]}>{tag}</span>
                    <span className="text-white/25 text-[11px]">{count} guidance areas</span>
                  </div>
                  <p className="text-white font-semibold text-[14px] mb-0.5" style={serif}>{label}</p>
                  <p className="text-white/30 text-[11px] truncate">{items}</p>
                </div>
                <ChevronRight size={14} className="flex-shrink-0" style={{ color: "rgba(255,255,255,0.20)" }}/>
              </a>))}
            <div className="flex items-center gap-3 pt-2 pl-2">
              <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${GOLD}30, transparent)` }}/>
              <span className="text-white/18 text-[11px]">10 guidance areas · 1 connected roadmap</span>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
// ─── SECTION 2: BENTO OVERVIEW ────────────────────────────────────────────────
function BentoOverview() {
    return (<section id="services" className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>All Guidance Areas</p>
          <h2 className="text-[38px] lg:text-[50px] font-bold text-[#0B0B0F] leading-tight mb-4" style={serif}>
            Ten Areas of Wealth Guidance.<br />
            <em style={{ fontStyle: "italic", color: BLUE }}>One Connected Roadmap.</em>
          </h2>
          <p className="text-[#6B7280] text-[16px] max-w-[520px] mx-auto leading-relaxed">
            Every guidance area GrowVest works in is connected to your bucket list goals — not sold separately as standalone products.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Hero card */}
          <div className="col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 p-8 lg:p-10 rounded-3xl flex flex-col justify-between min-h-[280px] group hover:-translate-y-1 transition-all" style={{ background: `linear-gradient(140deg, ${BLUE}, #1A3FB8)`, boxShadow: `0 8px 40px ${BLUE}35` }}>
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                <Target size={22} color={WHITE}/>
              </div>
              <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full" style={{ background: "rgba(245,179,1,0.25)", color: GOLD }}>Protect</span>
            </div>
            <div>
              <h3 className="text-[26px] lg:text-[30px] font-bold text-white mb-3 leading-snug" style={serif}>
                Goal-Based Investment Planning
              </h3>
              <p className="text-white/60 text-[14px] leading-relaxed mb-5">Every investment anchored to your life goals and personal timeline — not a product pitch.</p>
              <div className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: GOLD }}>
                Foundation of every plan <ArrowRight size={13}/>
              </div>
            </div>
          </div>

          {/* Remaining 9 services */}
          {SERVICES.slice(1).map(({ Icon, title, tag, color }) => (<div key={title} className="min-w-0 p-5 lg:p-6 rounded-3xl border hover:border-blue-200 hover:-translate-y-0.5 transition-all group cursor-default" style={{ background: GRAY, borderColor: "rgba(0,0,0,0.06)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${color}15` }}>
                  <Icon size={17} style={{ color }}/>
                </div>
                <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={tagStyles[tag]}>{tag}</span>
              </div>
              <h4 className="break-normal font-bold text-[#0B0B0F] text-[13px] leading-snug mb-1.5" style={serif}>{title}</h4>
              <div className="mt-3 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}/>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── SECTION 3: SERVICE EXPLORER (INTERACTIVE) ────────────────────────────────
function ServiceExplorer() {
    const [active, setActive] = useState(0);
    const svc = SERVICES[active];
    return (<section className="py-28 lg:py-36 relative" style={{ background: BLACK, ...dotGrid }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 55% 55% at 50% 50%, rgba(31,78,216,0.09) 0%, transparent 70%)`,
        }}/>

      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: GOLD }}>Guidance in Depth</p>
          <h2 className="text-[38px] lg:text-[50px] font-bold text-white leading-tight mb-4" style={serif}>
            Explore Every Guidance Area.<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>Understand What We Do.</em>
          </h2>
          <p className="text-white/40 text-[15px] max-w-[480px] mx-auto leading-relaxed">
            Select any guidance area to see exactly what GrowVest does, who it is for, and what you receive.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* Left: service list */}
          <div className="space-y-1.5 lg:sticky lg:top-24">
            {SERVICES.map((s, i) => {
            const isActive = active === i;
            return (<button type="button" aria-pressed={active === i} key={s.id} onClick={() => setActive(i)} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all" style={{
                    background: isActive ? "rgba(255,255,255,0.10)" : "transparent",
                    borderLeft: isActive ? `3px solid ${s.color}` : "3px solid transparent",
                }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isActive ? `${s.color}25` : "rgba(255,255,255,0.06)" }}>
                    <s.Icon size={14} style={{ color: isActive ? s.color : "rgba(255,255,255,0.35)" }}/>
                  </div>
                  <span className="text-[13px] font-medium leading-snug flex-1 text-left" style={{ color: isActive ? WHITE : "rgba(255,255,255,0.40)" }}>
                    {s.title}
                  </span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }}/>}
                </button>);
        })}
          </div>

          {/* Right: detail panel */}
          <div className="rounded-3xl overflow-hidden border" style={{ background: "rgba(255,255,255,0.06)", borderColor: `${svc.color}30`, boxShadow: `0 8px 48px ${svc.color}12` }}>
            {/* Header */}
            <div className="p-7 lg:p-8 border-b border-white/8">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${svc.color}25` }}>
                    <svc.Icon size={22} style={{ color: svc.color }}/>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full inline-block mb-1.5" style={darkTagStyles[svc.tag]}>{svc.tag}</span>
                    <h3 className="text-[22px] font-bold text-white leading-snug" style={serif}>{svc.title}</h3>
                  </div>
                </div>
              </div>
              <p className="text-[15px] font-semibold mb-3" style={{ color: `${svc.color}CC` }}>{svc.tagline}</p>
              <p className="text-white/55 text-[14px] leading-relaxed">{svc.what}</p>
            </div>

            {/* Body */}
            <div className="grid lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/8">
              {/* How it works */}
              <div className="p-7 lg:p-8">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-5" style={{ color: svc.color }}>How It Works</p>
                <ul className="space-y-3">
                  {svc.howItWorks.map((step, i) => (<li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5" style={{ background: `${svc.color}20`, color: svc.color, border: `1px solid ${svc.color}35` }}>
                        {i + 1}
                      </div>
                      <span className="text-white/60 text-[13.5px] leading-relaxed">{step}</span>
                    </li>))}
                </ul>
              </div>

              {/* Meta */}
              <div className="p-7 lg:p-8 space-y-6">
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>Who It's For</p>
                  <p className="text-white/65 text-[13.5px] leading-relaxed">{svc.whoFor}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>Connected Goals</p>
                  <p className="text-white/50 text-[13px] leading-relaxed italic">{svc.goalLink}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>What You Receive</p>
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold" style={{ background: `${svc.color}15`, color: svc.color, border: `1px solid ${svc.color}30` }}>
                    <Check size={11}/> {svc.receive}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
// ─── SECTION 4: PROTECT VS TRANSFORM ─────────────────────────────────────────
function ProtectTransform() {
    return (<section className="py-28 lg:py-36 bg-[#F4F6F9]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>Two Dimensions of Guidance</p>
          <h2 className="text-[38px] lg:text-[50px] font-bold text-[#0B0B0F] leading-tight mb-4" style={serif}>
            Protect Today.<br />
            <em style={{ fontStyle: "italic", color: BLUE }}>Transform Tomorrow.</em>
          </h2>
          <p className="text-[#6B7280] text-[16px] max-w-[520px] mx-auto leading-relaxed">
            GrowVest's guidance operates in two dimensions — protecting what matters today and transforming what is possible tomorrow.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Protect */}
          <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
            <div className="px-8 py-6" style={{ background: `linear-gradient(135deg, ${BLUE}15, ${BLUE}06)`, borderBottom: `2px solid ${BLUE}20` }}>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${BLUE}20` }}>
                  <Shield size={18} style={{ color: BLUE }}/>
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full" style={{ background: `${BLUE}15`, color: BLUE }}>Protect</span>
              </div>
              <h3 className="text-[24px] font-bold text-[#0B0B0F] mb-2" style={serif}>Protection-First Guidance</h3>
              <p className="text-[#6B7280] text-[14px] leading-relaxed">Securing your financial foundation before building upward. Without protection, every plan is at risk.</p>
            </div>
            <div className="bg-white px-5 sm:px-6 lg:px-8 py-6">
              <ul className="space-y-4">
                {SERVICES.filter(s => s.tag === "Protect").map(({ Icon, title, tagline, color }) => (<li key={title} className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12` }}>
                      <Icon size={15} style={{ color }}/>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0B0B0F] text-[14px] mb-0.5" style={serif}>{title}</p>
                      <p className="text-[#9CA3AF] text-[12px] leading-relaxed">{tagline}</p>
                    </div>
                  </li>))}
              </ul>
            </div>
          </div>

          {/* Transform */}
          <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
            <div className="px-8 py-6" style={{ background: `linear-gradient(135deg, ${GOLD}12, ${GOLD}04)`, borderBottom: `2px solid ${GOLD}25` }}>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${GOLD}20` }}>
                  <TrendingUp size={18} style={{ color: "#7A5200" }}/>
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full" style={{ background: `${GOLD}18`, color: "#7A5200" }}>Transform</span>
              </div>
              <h3 className="text-[24px] font-bold text-[#0B0B0F] mb-2" style={serif}>Transformation-Led Planning</h3>
              <p className="text-[#6B7280] text-[14px] leading-relaxed">Turning your aspirations into structured, measurable financial progress — from dream home to retirement.</p>
            </div>
            <div className="bg-white px-5 sm:px-6 lg:px-8 py-6">
              <ul className="space-y-4">
                {SERVICES.filter(s => s.tag === "Transform").map(({ Icon, title, tagline, color }) => (<li key={title} className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12` }}>
                      <Icon size={15} style={{ color }}/>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0B0B0F] text-[14px] mb-0.5" style={serif}>{title}</p>
                      <p className="text-[#9CA3AF] text-[12px] leading-relaxed">{tagline}</p>
                    </div>
                  </li>))}
              </ul>
            </div>
          </div>
        </div>

        {/* Review strip */}
        <div className="mt-6 rounded-3xl overflow-hidden border border-gray-100 bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#E8ECF4" }}>
              <RefreshCw size={16} style={{ color: MGRAY }}/>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#9CA3AF]">Review · Ongoing</span>
              <p className="font-semibold text-[#0B0B0F] text-[14px]" style={serif}>Guidance areas reviewed continuously to keep your plan on track</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {SERVICES.filter(s => s.tag === "Review").map(({ Icon, title, tagline, color }) => (<div key={title} className="px-7 py-5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12` }}>
                  <Icon size={14} style={{ color }}/>
                </div>
                <div>
                  <p className="font-semibold text-[#0B0B0F] text-[13px] mb-0.5" style={serif}>{title}</p>
                  <p className="text-[#9CA3AF] text-[11.5px] leading-relaxed">{tagline}</p>
                </div>
              </div>))}
          </div>
        </div>
      </div>
    </section>);
}
// ─── SECTION 5: SUITABILITY PROMISE ──────────────────────────────────────────
const SUITABILITY_POINTS = [
    { Icon: Target, title: "Goal Alignment", copy: "Every direction is considered against your specific goals — not general market conditions or popular trends." },
    { Icon: AlertCircle, title: "Risk Suitability", copy: "We use documented goals and risk preferences to frame the questions and options discussed." },
    { Icon: Calendar, title: "Horizon Matching", copy: "Investment approaches are matched to the time horizon of each goal — short-term goals get different treatment from long-term ones." },
    { Icon: FileText, title: "Documented Direction", copy: "Important directions are written, explained and confirmed through consent — so you always have a record of what was decided and why." },
    { Icon: Users, title: "Human Review", copy: "No algorithm replaces a human conversation at GrowVest. Important directions are reviewed by a team member familiar with the available context." },
    { Icon: RefreshCw, title: "Regular Reassessment", copy: "Suitability is not a one-time check. We reassess as your life, income, goals, and risk comfort change over time." },
];
function SuitabilityPromise() {
    return (<section className="py-28 lg:py-36 bg-white">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[420px_1fr] gap-14 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>Our Commitment</p>
            <h2 className="text-[38px] lg:text-[48px] font-bold text-[#0B0B0F] leading-tight mb-5" style={serif}>
              Every Direction Passes the Suitability Test.
            </h2>
            <p className="text-[#6B7280] text-[15px] leading-relaxed mb-8">
              At GrowVest, goal relevance and transparent communication are central to every discussion. Mutual fund-related support is provided in a distribution context.
            </p>
            <div className="p-5 rounded-2xl" style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}15` }}>
              <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: BLUE }}>GrowVest Standard</p>
              <p className="text-[#374151] text-[14px] leading-relaxed italic" style={serif}>
                "If it does not serve your goals, it does not belong in your plan."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUITABILITY_POINTS.map(({ Icon, title, copy }) => (<div key={title} className="p-6 rounded-3xl border border-gray-100 hover:border-blue-100 hover:-translate-y-0.5 transition-all group" style={{ background: GRAY, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${BLUE}10` }}>
                  <Icon size={17} style={{ color: BLUE }}/>
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
// ─── SECTION 6: GUIDANCE PRINCIPLES ──────────────────────────────────────────
const PRINCIPLES = [
    { num: "01", text: "Every guidance area connects to a specific life goal on your bucket list — never offered in isolation." },
    { num: "02", text: "Important decisions and consent-based actions are documented in writing." },
    { num: "03", text: "Every direction is reviewed regularly — not set and forgotten." },
    { num: "04", text: "Every investor receives guidance relevant to their life stage, risk profile, and priorities." },
    { num: "05", text: "Any applicable distribution, referral, platform or partner relationship should be disclosed before the client proceeds." },
];
function GuidancePrinciples() {
    return (<section className="py-28 lg:py-36 relative" style={{ background: BLACK, ...dotGrid }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 55% 50% at 30% 50%, rgba(31,78,216,0.10) 0%, transparent 70%)`,
        }}/>

      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 lg:px-8 relative">
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px w-12" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40)` }}/>
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: GOLD }}>Guidance Principles</p>
          </div>
          <h2 className="text-[46px] lg:text-[60px] font-bold text-white leading-[1.06] mb-6" style={serif}>
            Five Principles Behind<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>Every Direction We Discuss.</em>
          </h2>
          <p className="text-white/40 text-[16px] max-w-[540px] leading-relaxed">
            These are not aspirations — they are operational standards built into how GrowVest delivers guidance every time.
          </p>
        </div>

        <div className="space-y-4">
          {PRINCIPLES.map(({ num, text }) => (<div key={num} className="flex items-center gap-6 p-6 rounded-2xl border border-white/6 hover:border-white/15 hover:bg-white/4 transition-all group cursor-default">
              <div className="flex-shrink-0 text-[28px] font-bold tabular-nums" style={{ ...serif, color: `${GOLD}40` }}>{num}</div>
              <div className="w-px h-8 flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}/>
              <p className="text-white/65 text-[15px] leading-relaxed group-hover:text-white/80 transition-colors">{text}</p>
              <Check size={16} className="flex-shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: GOLD }}/>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── SECTION 7: CTA ───────────────────────────────────────────────────────────
function WealthGuidanceCTA() {
    return (<section className="relative py-36 lg:py-52 overflow-hidden" style={{ background: BLACK, ...dotGrid }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 65% 65% at 50% 50%, rgba(31,78,216,0.14) 0%, transparent 70%)`,
        }}/>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-28 pointer-events-none" style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}50)` }}/>

      {/* Floating service labels */}
      {["Goal-Based Planning", "Insurance", "Retirement", "SIP Guidance", "Tax", "Portfolio Review"].map((label, i) => (<div key={label} className="absolute pointer-events-none select-none" style={{ color: "rgba(255,255,255,0.05)", top: `${12 + (i * 13) % 75}%`, left: `${4 + (i * 16) % 88}%`, transform: `rotate(${-8 + (i * 6) % 16}deg)`, fontFamily: "'Libre Baskerville', serif", fontSize: "13px" }}>
          {label}
        </div>))}

      <div className="max-w-[800px] mx-auto px-5 sm:px-6 lg:px-8 text-center relative">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-10" style={{ background: `${GOLD}40` }}/>
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: GOLD }}>Begin Your Journey</span>
          <div className="h-px w-10" style={{ background: `${GOLD}40` }}/>
        </div>

        <h2 className="text-[48px] lg:text-[68px] font-bold text-white mb-6 leading-[1.04]" style={serif}>
          Your Goals Deserve<br />
          <em style={{ fontStyle: "italic", color: GOLD }}>Guidance That Fits.</em>
        </h2>

        <p className="text-white/45 text-[17px] leading-relaxed mb-12 max-w-[500px] mx-auto">
          Start by mapping your goals. GrowVest will connect each one to the right guidance area and build a structured plan around your life.
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
          {["Goal-Led Guidance", "Goal Relevance Checked", "Important Actions Documented"].map((item) => (<div key={item} className="flex items-center gap-2">
              <Check size={12} style={{ color: GOLD }}/>
              <span className="text-white/25 text-[12px]">{item}</span>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function WealthGuidance() {
    return (<>
      <Hero />
      <BentoOverview />
      <ServiceExplorer />
      <ProtectTransform />
      <SuitabilityPromise />
      <GuidancePrinciples />
      <WealthGuidanceCTA />
    </>);
}
