"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, ChevronRight, Star, TrendingUp, Shield, Target, Globe, Wallet, Users, Calendar, ArrowUpRight, Search, GraduationCap, Home as HomeIcon, Plane, Mail, Check, } from "lucide-react";
import { BLUE, BLACK, GOLD, WHITE, GRAY, MGRAY, serif, dotGrid } from "../lib/brand";
import { trackEvent } from "../lib/analytics";
// ─── DATA ─────────────────────────────────────────────────────────────────────
const CATEGORIES_LIST = ["All", "Bucket List", "Goal Planning", "Portfolio Strategy", "Protection", "Market Context", "GrowVest Perspective"];
const ARTICLES = [
    {
        id: 1,
        category: "Bucket List",
        title: "How to Convert Your Dreams into a Financial Corpus — Without Guessing.",
        excerpt: "Most investors think in amounts. The right way is to think in goals. Here is how every dream on your bucket list can be mapped to a precise corpus, a timeline, and a monthly SIP — so nothing is left to chance.",
        readTime: "7 min",
        date: "21 Jul 2026",
        color: GOLD,
        Icon: Target,
        featured: true,
        tag: "Transform",
    },
    {
        id: 2,
        category: "Goal Planning",
        title: "Why Your Child's Education Corpus Should Be Built Before Anything Else.",
        excerpt: "Education costs can rise meaningfully over time. Starting earlier can create more room for compounding, periodic increases and course corrections.",
        readTime: "5 min",
        date: "14 Jul 2026",
        color: "#8B5CF6",
        Icon: GraduationCap,
        tag: "Transform",
    },
    {
        id: 3,
        category: "Portfolio Strategy",
        title: "The Rebalancing Decision: When Markets Run and Your Allocation Drifts.",
        excerpt: "Portfolio drift is silent and natural. Left unreviewed, a 60/40 equity-debt portfolio can become 80/20 — carrying far more risk than you intended. Here is a framework for when and how to rebalance.",
        readTime: "6 min",
        date: "07 Jul 2026",
        color: "#10B981",
        Icon: TrendingUp,
        tag: "Review",
    },
    {
        id: 4,
        category: "Protection",
        title: "The Insurance Gap Nobody Talks About: Cover That Doesn't Match the Goal.",
        excerpt: "Most insured families are underinsured — not because they lack policies, but because their cover is not calibrated to their income replacement need and outstanding liabilities.",
        readTime: "6 min",
        date: "30 Jun 2026",
        color: "#E53935",
        Icon: Shield,
        tag: "Protect",
    },
    {
        id: 5,
        category: "Goal Planning",
        title: "Dream Home vs Retirement: How to Prioritise When You Can't Fund Both at Once.",
        excerpt: "When two large goals compete for the same capital, most investors freeze. There is a methodical way to sequence them — and it starts with understanding which goal has less time to compound.",
        readTime: "8 min",
        date: "23 Jun 2026",
        color: BLUE,
        Icon: HomeIcon,
        tag: "Transform",
    },
    {
        id: 6,
        category: "Market Context",
        title: "What Mid-Cap Outperformance Means for Your Long-Term Goal Timelines.",
        excerpt: "The mid-cap rally of 2025 reshuffled many portfolios. Here is what changed, what it means for investors with 10+ year goal horizons, and why rebalancing without a goal lens can be a mistake.",
        readTime: "5 min",
        date: "16 Jun 2026",
        color: "#F97316",
        Icon: Globe,
        tag: "Review",
    },
    {
        id: 7,
        category: "Bucket List",
        title: "Funding the Sabbatical: How to Plan a Six-Month Travel Goal Without Guilt.",
        excerpt: "A sabbatical is not indulgence — it is restoration. Here is how to build a dedicated travel corpus, keep it isolated from long-term goals, and execute the break without compromising your wealth journey.",
        readTime: "7 min",
        date: "09 Jun 2026",
        color: "#EC4899",
        Icon: Plane,
        tag: "Transform",
    },
    {
        id: 8,
        category: "GrowVest Perspective",
        title: "Why Market Timing Feels Compelling — and Why Goal Clarity Matters More.",
        excerpt: "Market movements can create pressure to act quickly. A written goal, timeline and risk framework can help investors separate short-term emotion from long-term purpose.",
        readTime: "9 min",
        date: "02 Jun 2026",
        color: BLUE,
        Icon: Users,
        tag: "Review",
    },
    {
        id: 9,
        category: "Protection",
        title: "Estate Planning Isn't Just for the Wealthy: Why Every Goal-Driven Investor Needs a Will.",
        excerpt: "A goal-linked financial plan without nomination clarity and a valid will is only half-built. This is a conversation that is often delayed — and the one that matters most.",
        readTime: "6 min",
        date: "26 May 2026",
        color: "#14B8A6",
        Icon: Wallet,
        tag: "Protect",
    },
    {
        id: 10,
        category: "Portfolio Strategy",
        title: "Debt Funds and Fixed Deposits: Questions to Ask for a Near-Term Goal.",
        excerpt: "The right questions include the goal timeline, liquidity, taxation, credit risk and the need for certainty. A headline rate alone does not tell the full story.",
        readTime: "6 min",
        date: "19 May 2026",
        color: "#8B5CF6",
        Icon: TrendingUp,
        tag: "Transform",
    },
    {
        id: 11,
        category: "GrowVest Perspective",
        title: "Why Important Life Goals Often Get Deferred — and How to Bring Them Back into the Plan.",
        excerpt: "Travel, legacy and personal-growth goals are often postponed because urgent responsibilities take priority. A clear goal map can help keep meaningful experiences visible without ignoring essential needs.",
        readTime: "8 min",
        date: "12 May 2026",
        color: GOLD,
        Icon: Star,
        tag: "Transform",
    },
    {
        id: 12,
        category: "Market Context",
        title: "Why Inflation-Adjusted Progress Matters for Long-Term Goals.",
        excerpt: "Nominal returns can look strong while purchasing power changes slowly. Goal reviews should consider inflation, taxes, costs and the actual amount required at the target date.",
        readTime: "5 min",
        date: "05 May 2026",
        color: "#F97316",
        Icon: Globe,
        tag: "Review",
    },
];
const TAG_STYLE = {
    Protect: { bg: "rgba(31,78,216,0.12)", color: BLUE },
    Transform: { bg: "rgba(245,179,1,0.15)", color: "#7A5200" },
    Review: { bg: "rgba(107,114,128,0.12)", color: "#4B5563" },
};
// ─── SECTION 1: HERO ──────────────────────────────────────────────────────────
function Hero() {
    return (<section className="relative min-h-[72vh] flex items-end overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `
          radial-gradient(ellipse 50% 60% at 80% 30%, rgba(31,78,216,0.14) 0%, transparent 65%),
          radial-gradient(ellipse 35% 45% at 15% 75%, rgba(245,179,1,0.06) 0%, transparent 60%)
        `,
        }}/>

      <div className="max-w-[1320px] mx-auto px-8 w-full py-20 lg:py-28 relative">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-end">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: GOLD }}/>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>Insights</span>
            </div>
            <h1 className="text-[52px] xl:text-[72px] font-bold text-white mb-6 leading-[1.03]" style={serif}>
              Wealth Begins<br />
              with <em style={{ color: GOLD, fontStyle: "italic" }}>Clarity.</em>
            </h1>
            <p className="text-white/45 text-[17px] leading-relaxed max-w-[480px]">
              Educational perspectives on goal planning, financial habits, mutual fund awareness, protection thinking and the life decisions that shape long-term wealth.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pb-1">
            {[
            { value: "12", label: "Insight Previews", color: GOLD },
            { value: "7", label: "Content Topics", color: BLUE },
            { value: "Goal-Led", label: "Editorial Approach", color: "#10B981" },
            { value: "Educational", label: "Content Purpose", color: "#8B5CF6" },
        ].map(({ value, label, color }) => (<div key={label} className="p-5 rounded-2xl border border-white/8 flex flex-col gap-1" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}>
                <span className="text-[34px] font-bold leading-none" style={{ ...serif, color }}>{value}</span>
                <span className="text-white/35 text-[12px] leading-snug">{label}</span>
              </div>))}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2.5 mt-10 pt-10 border-t border-white/8">
          {CATEGORIES_LIST.filter(c => c !== "All").map((cat) => (<div key={cat} className="px-4 py-1.5 rounded-full text-[12px] font-medium text-white/65 border border-white/10">
              {cat}
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── SECTION 2: FEATURED ARTICLE ──────────────────────────────────────────────
function FeaturedArticle() {
    const featured = ARTICLES.find(a => a.featured);
    const { tag, color, Icon, category, title, excerpt, readTime, date } = featured;
    const tagStyle = TAG_STYLE[tag];
    return (<section className="py-20 bg-white">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px w-12" style={{ background: `linear-gradient(90deg, transparent, ${BLUE}30)` }}/>
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: MGRAY }}>Featured Insight</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-0 rounded-3xl overflow-hidden border border-gray-100 group transition-all" style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.08)" }}>
          {/* Visual panel */}
          <div className="relative min-h-[360px] lg:min-h-[460px] p-10 flex flex-col justify-between" style={{ background: `linear-gradient(135deg, ${BLACK} 0%, #16182E 100%)`, ...dotGrid }}>
            <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 55% 55% at 30% 50%, ${color}18 0%, transparent 70%)`,
        }}/>

            {/* Category badge */}
            <div className="flex items-center justify-between relative z-10">
              <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold border" style={{ background: `${color}15`, color, borderColor: `${color}30` }}>{category}</span>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full" style={{ background: tagStyle.bg, color: tagStyle.color }}>
                {tag}
              </span>
            </div>

            {/* Large icon composition */}
            <div className="flex items-end gap-6 relative z-10">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: `${color}18`, border: `1.5px solid ${color}30` }}>
                <Icon size={34} style={{ color }}/>
              </div>
              <div className="flex flex-col gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-white/30"/>
                  <span className="text-white/30 text-[11px]">{readTime} read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-white/30"/>
                  <span className="text-white/30 text-[11px]">{date}</span>
                </div>
              </div>
            </div>

            {/* Decorative text watermark */}
            <div className="absolute bottom-8 right-8 text-[64px] font-bold opacity-[0.04] pointer-events-none select-none" style={serif}>01</div>
          </div>

          {/* Content panel */}
          <div className="p-10 lg:p-12 flex flex-col justify-between bg-white group-hover:bg-[#FAFBFF] transition-colors">
            <div>
              <div className="h-0.5 w-10 rounded-full mb-8" style={{ background: color }}/>
              <h2 className="text-[26px] lg:text-[30px] font-bold text-[#0B0B0F] leading-[1.18] mb-6" style={serif}>{title}</h2>
              <p className="text-[#6B7280] text-[15px] leading-relaxed mb-8">{excerpt}</p>
            </div>
            <div>
              <Link href="#all-insights" className="inline-flex items-center gap-2.5 text-[14px] font-semibold transition-all hover:gap-4 group/btn" style={{ color: BLUE }}>
                Browse All Insights <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1"/>
              </Link>
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${BLUE}12` }}>
                  <Users size={12} style={{ color: BLUE }}/>
                </div>
                <span className="text-[#9CA3AF] text-[12px]">GrowVest Perspective · Featured Insight</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
// ─── SECTION 3: INSIGHTS GRID WITH FILTER ────────────────────────────────────
function InsightsGrid() {
    const [active, setActive] = useState("All");
    const [search, setSearch] = useState("");
    const filtered = ARTICLES.filter(a => {
        const matchCat = active === "All" || a.category === active;
        const matchSearch = search === "" || a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch && !a.featured;
    });
    return (<section id="all-insights" className="py-20 lg:py-28 bg-[#F4F6F9]">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: MGRAY }}>All Insights</p>
            <h2 className="text-[30px] font-bold text-[#0B0B0F]" style={serif}>Browse by Category</h2>
          </div>

          {/* Search */}
          <div className="relative max-w-[280px] w-full">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search insights..." className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white border border-gray-200 text-[13px] text-gray-700 placeholder-gray-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"/>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES_LIST.map(cat => (<button type="button" aria-pressed={active === cat} key={cat} onClick={() => setActive(cat)} className="px-4 py-2 rounded-full text-[13px] font-medium transition-all" style={{
                background: active === cat ? BLUE : WHITE,
                color: active === cat ? WHITE : "#6B7280",
                border: `1.5px solid ${active === cat ? BLUE : "rgba(0,0,0,0.08)"}`,
                boxShadow: active === cat ? `0 4px 16px ${BLUE}30` : "none",
            }}>
              {cat}
            </button>))}
        </div>

        {filtered.length === 0 ? (<div className="text-center py-24 text-[#9CA3AF]">
            <BookOpen size={32} className="mx-auto mb-4 opacity-30"/>
            <p className="text-[16px]">No insights found for this search.</p>
          </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(article => {
                const { id, color, Icon, category, tag, title, excerpt, readTime, date } = article;
                const tagStyle = TAG_STYLE[tag];
                return (<div key={id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-blue-100 hover:-translate-y-1 transition-all group" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }} onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 8px 32px ${color}12`)} onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)")}>

                  {/* Color strip header */}
                  <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}60)` }}/>

                  <div className="p-6 lg:p-7">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${color}12` }}>
                        <Icon size={16} style={{ color }}/>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: tagStyle.bg, color: tagStyle.color }}>{tag}</span>
                    </div>

                    <span className="text-[11px] font-bold tracking-widest uppercase mb-2 block" style={{ color: `${color}AA` }}>{category}</span>
                    <h3 className="font-bold text-[#0B0B0F] text-[16px] leading-[1.3] mb-3 group-hover:text-blue-700 transition-colors" style={serif}>{title}</h3>
                    <p className="text-[#6B7280] text-[13px] leading-relaxed line-clamp-3 mb-6">{excerpt}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Clock size={11} className="text-gray-300"/>
                          <span className="text-[11px] text-gray-400">{readTime}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-200"/>
                        <span className="text-[11px] text-gray-400">{date}</span>
                      </div>
                      <ArrowUpRight size={14} className="text-gray-300 group-hover:text-blue-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"/>
                    </div>
                  </div>
                </div>);
            })}
          </div>)}
      </div>
    </section>);
}
// ─── SECTION 4: ADVISOR PERSPECTIVE SPOTLIGHT ────────────────────────────────
const PERSPECTIVES = [
    {
        quote: "A financial plan built around life goals is fundamentally different from a plan built around asset allocation. One answers 'what are we building towards?' The other only answers 'how are we invested?' We always start with the first question.",
        name: "GrowVest Perspective",
        tenure: "Educational viewpoint",
        color: BLUE,
    },
    {
        quote: "Investors who know their goals almost never panic-sell. When a market correction hits and you know the money is for your child's college in 2034, the short-term noise becomes irrelevant. Goal clarity is the best behavioural tool we have.",
        name: "GrowVest Perspective",
        tenure: "Educational viewpoint",
        color: GOLD,
    },
    {
        quote: "The biggest wealth gap I see is not the investment gap — it is the insurance gap. Families with well-invested portfolios and unreviewed insurance covers are one event away from undoing years of discipline. Protection is not separate from the plan; it is the foundation.",
        name: "GrowVest Educational Perspective",
        tenure: "GrowVest",
        color: "#10B981",
    },
];
function AdvisorPerspectives() {
    const [active, setActive] = useState(0);
    const p = PERSPECTIVES[active];
    return (<section className="py-28 lg:py-36 relative" style={{ background: BLACK, ...dotGrid }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 55% 55% at 50% 50%, rgba(31,78,216,0.08) 0%, transparent 70%)`,
        }}/>

      <div className="max-w-[1000px] mx-auto px-8 relative text-center">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-10" style={{ background: `${GOLD}40` }}/>
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: GOLD }}>GrowVest Perspectives</p>
          <div className="h-px w-10" style={{ background: `${GOLD}40` }}/>
        </div>

        {/* Selector */}
        <div className="flex items-center justify-center gap-3 mb-14">
          {PERSPECTIVES.map((per, i) => (<button type="button" aria-label={`Show perspective ${i + 1}`} aria-pressed={active === i} key={i} onClick={() => setActive(i)} className="w-2.5 h-2.5 rounded-full transition-all" style={{ background: active === i ? per.color : "rgba(255,255,255,0.18)", transform: active === i ? "scale(1.3)" : "scale(1)" }}/>))}
        </div>

        {/* Quote */}
        <div className="relative">
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[120px] leading-none font-serif text-white opacity-[0.04] select-none pointer-events-none">"</span>
          <blockquote className="text-white/70 text-[20px] lg:text-[24px] leading-relaxed font-light mb-10 italic" style={serif}>
            "{p.quote}"
          </blockquote>
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${p.color}20`, border: `1.5px solid ${p.color}35` }}>
            <Users size={16} style={{ color: p.color }}/>
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-[14px]" style={serif}>{p.name}</p>
            <p className="text-white/35 text-[12px]">{p.tenure}</p>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <button type="button" aria-label="Show previous perspective" onClick={() => setActive((active - 1 + PERSPECTIVES.length) % PERSPECTIVES.length)} className="w-9 h-9 rounded-full border border-white/12 flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all">
            <ChevronRight size={14} className="text-white/40 rotate-180"/>
          </button>
          <span className="text-white/20 text-[12px] tabular-nums">{String(active + 1).padStart(2, "0")} / {String(PERSPECTIVES.length).padStart(2, "0")}</span>
          <button type="button" aria-label="Show next perspective" onClick={() => setActive((active + 1) % PERSPECTIVES.length)} className="w-9 h-9 rounded-full border border-white/12 flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all">
            <ChevronRight size={14} className="text-white/40"/>
          </button>
        </div>
      </div>
    </section>);
}
// ─── SECTION 5: TOPIC EXPLORER ────────────────────────────────────────────────
const TOPIC_CARDS = [
    { Icon: Target, label: "Bucket List", count: 8, color: GOLD, desc: "How to map life goals to financial milestones." },
    { Icon: GraduationCap, label: "Goal Planning", count: 11, color: "#8B5CF6", desc: "Goal sequencing, corpus targets, and timelines." },
    { Icon: TrendingUp, label: "Portfolio Strategy", count: 9, color: "#10B981", desc: "Allocation, rebalancing, and fund selection." },
    { Icon: Shield, label: "Protection", count: 7, color: "#E53935", desc: "Insurance, estate planning, and risk coverage." },
    { Icon: Globe, label: "Market Context", count: 8, color: "#F97316", desc: "How macro events affect your goal timelines." },
    { Icon: Users, label: "GrowVest Perspective", count: 5, color: BLUE, desc: "Advisory philosophy, behavioural finance, and craft." },
];
function TopicExplorer() {
    return (<section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: MGRAY }}>Explore by Topic</p>
          <h2 className="text-[34px] lg:text-[46px] font-bold text-[#0B0B0F] leading-tight" style={serif}>
            Every Dimension of Your<br />Wealth Journey, Covered.
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPIC_CARDS.map(({ Icon, label, count, color, desc }) => (<div key={label} className="p-7 rounded-3xl border border-gray-100 hover:border-opacity-50 hover:-translate-y-1 transition-all group relative overflow-hidden" style={{ background: GRAY, boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }} onMouseEnter={e => { e.currentTarget.style.background = WHITE; e.currentTarget.style.boxShadow = `0 8px 32px ${color}12`; }} onMouseLeave={e => { e.currentTarget.style.background = GRAY; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)"; }}>

              <div className="absolute top-4 right-5 text-[48px] font-bold opacity-[0.04] pointer-events-none select-none tabular-nums" style={{ ...serif, color }}>{count}</div>

              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ background: `${color}14` }}>
                <Icon size={20} style={{ color }}/>
              </div>
              <h4 className="font-bold text-[#0B0B0F] text-[15px] mb-1.5 group-hover:text-blue-700 transition-colors" style={serif}>{label}</h4>
              <p className="text-[#6B7280] text-[12.5px] leading-relaxed mb-4">{desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold" style={{ color }}>{count} articles</span>
                <ArrowUpRight size={13} className="transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color }}/>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-3xl scale-x-0 group-hover:scale-x-100 transition-transform duration-500" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}/>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── SECTION 6: NEWSLETTER CTA ────────────────────────────────────────────────
function NewsletterCTA() {
    const [email, setEmail] = useState("");
    const [consent, setConsent] = useState(false);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [website, setWebsite] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("submitting");
        setError("");
        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, consent, website }),
            });
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message || "We could not complete your subscription.");
            setStatus("success");
            trackEvent("newsletter_subscription_submitted", { source: "insights_page" });
        }
        catch (submissionError) {
            setStatus("error");
            trackEvent("newsletter_subscription_error", { source: "insights_page" });
            setError(submissionError.message || "Please try again later.");
        }
    }

    return (<section className="py-28 lg:py-36 bg-[#F4F6F9]">
      <div className="max-w-[800px] mx-auto px-8 text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-8 flex items-center justify-center" style={{ background: `${BLUE}12` }}>
          <Mail size={22} style={{ color: BLUE }}/>
        </div>
        <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>Monthly Dispatch</p>
        <h2 className="text-[36px] lg:text-[50px] font-bold text-[#0B0B0F] leading-tight mb-5" style={serif}>
          One Monthly Read.<br />
          <em style={{ fontStyle: "italic", color: BLUE }}>Designed for Conscious Wealth Decisions.</em>
        </h2>
        <p className="text-[#6B7280] text-[16px] leading-relaxed mb-10 max-w-[540px] mx-auto">
          A monthly digest covering goal planning, financial habits, mutual fund education, protection thinking and meaningful wealth journeys.
        </p>

        {status === "success" ? (<div className="inline-flex items-center gap-3 px-8 py-4 rounded-full" style={{ background: "#D1FAE5", border: "1.5px solid #A7F3D0" }} aria-live="polite">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <Check size={12} className="text-white"/>
            </div>
            <span className="text-emerald-700 font-semibold text-[15px]">Subscription received. Please check your inbox for future GrowVest updates.</span>
          </div>) : (<form onSubmit={handleSubmit} className="max-w-[500px] mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input id="newsletter-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" className="flex-1 px-5 py-4 rounded-full border border-gray-200 bg-white text-[14px] text-gray-700 placeholder-gray-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"/>
              <button type="submit" data-analytics-event="newsletter_submit_click" data-analytics-location="insights_page" disabled={status === "submitting"} className="px-7 py-4 rounded-full text-white font-semibold text-[14px] transition-all hover:opacity-90 hover:-translate-y-0.5 flex-shrink-0 disabled:opacity-50" style={{ background: BLUE, boxShadow: `0 6px 24px ${BLUE}40` }}>
                {status === "submitting" ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="newsletter-website">Website</label>
              <input id="newsletter-website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)}/>
            </div>
            <label className="mt-4 flex items-start justify-center gap-2 text-left text-[11px] leading-relaxed text-[#6B7280]">
              <input required type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-blue-600"/>
              <span>I agree to receive GrowVest educational updates and understand that I can unsubscribe at any time.</span>
            </label>
            {error && <p role="alert" className="mt-4 text-[12px] text-red-600">{error}</p>}
          </form>)}

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
          {["Monthly Only", "No Spam", "Unsubscribe Anytime"].map(item => (<div key={item} className="flex items-center gap-1.5">
              <Check size={11} style={{ color: BLUE }}/>
              <span className="text-[#9CA3AF] text-[12px]">{item}</span>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── SECTION 7: CTA ───────────────────────────────────────────────────────────
function InsightsCTA() {
    return (<section className="relative py-36 lg:py-52 overflow-hidden" style={{ background: BLACK, ...dotGrid }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 65% 65% at 50% 50%, rgba(31,78,216,0.13) 0%, transparent 70%)`,
        }}/>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-28 pointer-events-none" style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}50)` }}/>

      {["Clarity", "Consistency", "Corpus", "Progress", "Goal", "Review"].map((word, i) => (<div key={word} className="absolute pointer-events-none select-none" style={{ color: "rgba(255,255,255,0.04)", top: `${10 + (i * 14) % 78}%`, left: `${5 + (i * 17) % 86}%`, transform: `rotate(${-10 + (i * 7) % 20}deg)`, fontFamily: "'Libre Baskerville', serif", fontSize: "14px" }}>
          {word}
        </div>))}

      <div className="max-w-[780px] mx-auto px-8 text-center relative">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-10" style={{ background: `${GOLD}40` }}/>
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: GOLD }}>Ready to Begin</span>
          <div className="h-px w-10" style={{ background: `${GOLD}40` }}/>
        </div>

        <h2 className="text-[46px] lg:text-[66px] font-bold text-white mb-6 leading-[1.04]" style={serif}>
          Reading Alone Won't<br />
          <em style={{ fontStyle: "italic", color: GOLD }}>Build the Wealth.</em>
        </h2>

        <p className="text-white/40 text-[17px] leading-relaxed mb-12 max-w-[500px] mx-auto">
          The insights here are the foundation. The real work begins when your goals are mapped, your plan is built, and your reviews are scheduled.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/your-goals" className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-white font-semibold text-[16px] transition-all hover:opacity-90 hover:-translate-y-1" style={{ background: BLUE, boxShadow: `0 12px 40px ${BLUE}55` }}>
            Map Your Bucket List Goals <ArrowRight size={19}/>
          </Link>
          <Link href="/the-growvest-way" className="inline-flex items-center gap-2 px-8 py-5 rounded-full font-semibold text-[15px] border transition-all hover:bg-white/5" style={{ borderColor: `${GOLD}40`, color: GOLD }}>
            The GrowVest Way
          </Link>
        </div>
      </div>
    </section>);
}
// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Insights() {
    return (<>
      <Hero />
      <FeaturedArticle />
      <InsightsGrid />
      <AdvisorPerspectives />
      <TopicExplorer />
      <NewsletterCTA />
      <InsightsCTA />
    </>);
}
