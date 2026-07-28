import Link from "next/link";
import { ArrowRight, Check, Shield, TrendingUp, Users, Eye, Target, Star, ChevronRight, Calendar, FileText, BarChart3, Briefcase, Home as HomeIcon, Plane, GraduationCap, DollarSign, Globe, Lock, Compass, ClipboardList, X, } from "lucide-react";
import { BLUE, BLACK, GOLD, WHITE, MGRAY, RED, COMPANY, serif, dotGrid } from "../lib/brand";
import { GrowVestMark } from "../components/GrowVestMark";
import { HeroPromise } from "../components/HeroPromise";
import { HomeBucketListPreview } from "../components/HomeBucketListPreview";
import { GrowVestJourney } from "../components/GrowVestJourney";
import { InvestorTestimonials } from "../components/InvestorTestimonials";
import { listCategories, listInsights } from "../lib/server/insightsRepository";
// ─── HERO ─────────────────────────────────────────────────────────────────────
const heroGoals = [
    { Icon: GraduationCap, label: "Child Education", color: GOLD },
    { Icon: HomeIcon, label: "Dream Home", color: BLUE },
    { Icon: Star, label: "Retirement", color: "#10B981" },
    { Icon: Shield, label: "Family Protection", color: RED },
    { Icon: Plane, label: "Travel & Experiences", color: "#8B5CF6" },
    { Icon: DollarSign, label: "Emergency Fund", color: GOLD },
    { Icon: TrendingUp, label: "Loan Closure", color: "#3B82F6" },
    { Icon: Globe, label: "Legacy Planning", color: "#EC4899" },
];
function Hero({ content = {} }) {
    const hero = content.hero || {};
    return (<section className="relative flex min-h-screen items-center overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 60% 70% at 22% 60%, rgba(31,78,216,0.22) 0%, transparent 65%),
                     radial-gradient(ellipse 30% 35% at 78% 22%, rgba(245,179,1,0.09) 0%, transparent 65%)`,
        }}/>
      <div data-parallax-speed="-0.035" className="gv-parallax absolute -right-[9%] top-[16%] hidden w-[560px] text-[#1F4ED8]/[0.20] pointer-events-none lg:block xl:w-[700px]">
        <GrowVestMark animated ambient outlined decorative className="h-auto w-full"/>
      </div>
      <div className="relative mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px] xl:gap-20">
          <div className="relative z-10">
            <div className="gv-hero-intro gv-hero-intro--1 mb-9 flex items-center gap-3">
              <div className="h-px w-8" style={{ background: GOLD }}/>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>{hero.eyebrow || COMPANY.positioning}</span>
            </div>
            <h1 className="gv-hero-intro gv-hero-intro--2 mb-7 text-[42px] font-bold leading-[1.04] text-white sm:text-[52px] xl:text-[72px]" style={serif}>
              {hero.headlineTop || "Your Bucket List"}<br/><em style={{ color: GOLD, fontStyle: "italic" }}>{hero.headlineAccent || "Deserves"}</em><br/>{hero.headlineBottom || "a Financial Roadmap."}
            </h1>
            <p className="gv-hero-intro gv-hero-intro--3 mb-5 max-w-[540px] text-[17px] leading-relaxed text-white/55">
              {hero.description || "GrowVest helps individuals and families protect what matters today and grow toward what is possible tomorrow through human understanding, disciplined planning and thoughtful financial guidance."}
            </p>
            <div className="gv-hero-intro gv-hero-intro--4">
              <HeroPromise/>
            </div>
            <div className="gv-hero-intro gv-hero-intro--5 flex flex-col gap-4 sm:flex-row">
              <Link href={hero.primaryCtaHref || "/contact"} data-analytics-event="primary_cta_click" data-analytics-location="home_hero" className="gv-btn-primary inline-flex items-center justify-center gap-2.5">
                {hero.primaryCtaLabel || "Begin Your Journey"} <ArrowRight size={17}/>
              </Link>
              <Link href={hero.secondaryCtaHref || "/your-goals"} data-analytics-event="secondary_cta_click" data-analytics-location="home_hero" className="gv-btn-secondary gv-btn-secondary--dark inline-flex items-center justify-center gap-2">
                {hero.secondaryCtaLabel || "Explore Your Goals"}
              </Link>
            </div>
            <p className="gv-hero-intro gv-hero-intro--5 mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">{hero.footerLine || COMPANY.vision}</p>
          </div>

          <div data-parallax-speed="0.018" className="gv-parallax relative">
            <div className="absolute -inset-8 rounded-[48px] opacity-15 blur-3xl pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 50%, ${BLUE}, transparent)` }}/>
            <div className="mb-5 flex items-center justify-center gap-2">
              <div className="h-px max-w-16 flex-1 opacity-40" style={{ background: `linear-gradient(90deg, transparent, ${GOLD})` }}/>
              <div className="rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: `${GOLD}40`, color: GOLD, background: `${GOLD}10` }}>Your Bucket List Goals</div>
              <div className="h-px max-w-16 flex-1 opacity-40" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}/>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {heroGoals.map(({ Icon, label, color }, i) => (<div key={label} className="group relative flex items-center gap-3 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:border-white/25" style={{ background: "rgba(255,255,255,0.055)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.10)", boxShadow: "0 4px 24px rgba(0,0,0,0.28)" }}>
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all group-hover:scale-110" style={{ background: `${color}22`, border: `1px solid ${color}40` }}>
                    <Icon size={15} style={{ color }}/>
                  </div>
                  <span className="text-[13px] font-medium leading-tight text-white/80">{label}</span>
                  <div className="absolute bottom-0 left-0 h-0.5 rounded-full opacity-30 transition-opacity group-hover:opacity-60" style={{ width: `${35 + (i * 11) % 45}%`, background: `linear-gradient(90deg, ${color}, transparent)` }}/>
                </div>))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="h-px w-14" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}60)` }}/>
              <span className="text-[11px] tracking-wide text-white/30">Connected by your roadmap</span>
              <div className="h-px w-14" style={{ background: `linear-gradient(90deg, ${GOLD}60, transparent)` }}/>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
// ─── VERIFIED TRUST STRIP ────────────────────────────────────────────────────
function TrustProofStrip({ content = {} }) {
    const trust = content.trust || {};
    const proof = trust.items?.length ? trust.items : [
        { value: COMPANY.clientsSupported, label: "Clients Supported" },
        { value: COMPANY.reviewsCompleted, label: "Structured Reviews" },
        { value: COMPANY.coverage, label: "Service Coverage" },
        { value: "NISM-Series-V-A", label: "Certified Professional Support" },
        { value: "₹0", label: "Direct Advisory Fee Currently Charged" },
    ];

    return (<section className="border-y border-black/[0.06] bg-white py-7">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {proof.map(({ value, label }, index) => (<div key={label} className={`relative ${index ? "lg:border-l lg:border-black/[0.08] lg:pl-6" : ""}`}>
              <p className="font-serif text-[21px] font-bold text-[#0B0B0F]">{value}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[#6B7280]">{label}</p>
            </div>))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
          <p className="text-[11px] leading-relaxed text-[#6B7280]">{trust.disclosure || "GrowVest is not registered with SEBI as an Investment Adviser. Certification and compensation details are explained transparently."}</p>
          <Link href={trust.disclosureLinkHref || "/how-we-charge"} className="text-[11px] font-semibold text-[#1F4ED8] hover:underline">{trust.disclosureLinkLabel || "How GrowVest works"} →</Link>
        </div>
      </div>
    </section>);
}

// ─── TRUST OPERATING SYSTEM ───────────────────────────────────────────────────
const pillars = [
    { Icon: ClipboardList, title: "Disciplined by Process", copy: "Every step is mapped, documented, and reviewed with responsibility. Nothing is left to assumption." },
    { Icon: Compass, title: "Guided by Purpose", copy: "Every financial direction begins with the investor's goals and life priorities — not a product shelf." },
    { Icon: Lock, title: "Built on Trust", copy: "Every conversation is guided by transparency, suitability, and long-term care for the investor." },
];
const trustChips = ["Goal-Based Guidance", "Risk-Aware Planning", "Monthly Reviews", "Transparent Communication", "Consent-Based Process", "Long-Term Relationship"];
function TrustOperatingSystem() {
    return (<section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>How We Work</p>
          <h2 className="text-[40px] lg:text-[52px] font-bold text-[#0B0B0F] leading-tight mb-4" style={serif}>
            Disciplined by Process.<br />Guided by Purpose. Built on Trust.
          </h2>
          <p className="text-[#6B7280] text-[16px] max-w-[540px] mx-auto leading-relaxed">GrowVest brings structure, responsibility, and clarity to every investor journey.</p>
        </div>
        <div className="relative">
          <div className="absolute top-10 left-[calc(16.6%+32px)] right-[calc(16.6%+32px)] h-0.5 hidden lg:block pointer-events-none" style={{ background: `linear-gradient(90deg, ${GOLD}60, ${GOLD}, ${GOLD}60)`, zIndex: 0 }}/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {pillars.map(({ Icon, title, copy }, i) => (<div key={title} className="relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-100 hover:-translate-y-1 transition-all group" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.07)", zIndex: 1 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${BLUE}10` }}>
                    <Icon size={22} style={{ color: BLUE }}/>
                  </div>
                  <div className="w-2 h-2 rounded-full" style={{ background: GOLD }}/>
                </div>
                <h3 className="text-[19px] font-bold text-[#0B0B0F] mb-3" style={serif}>{title}</h3>
                <p className="text-[#6B7280] text-[14px] leading-relaxed">{copy}</p>
                <div className="absolute -top-3 left-8">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: GOLD }}>{i + 1}</div>
                </div>
              </div>))}
          </div>
        </div>
        <div className="mt-10 pt-10 border-t border-gray-100 flex flex-wrap items-center justify-center gap-3">
          {trustChips.map((chip) => (<div key={chip} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium border" style={{ borderColor: `${BLUE}25`, color: BLUE, background: `${BLUE}06` }}>
              <Check size={12} style={{ color: GOLD }}/>{chip}
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── BRAND BELIEF ─────────────────────────────────────────────────────────────
function BrandBelief({ content = {} }) {
    const belief = content.brandBelief || {};
    const beliefParagraphs = belief.paragraphs?.length ? belief.paragraphs : ["Before any financial direction, GrowVest understands your responsibilities, aspirations, family priorities, risk comfort, and future milestones.", "Then we turn those goals into a structured financial roadmap — built with clarity, reviewed with discipline, and guided with care."];
    return (<section className="py-28 lg:py-40 bg-[#F4F6F9]">
      <div className="max-w-[1000px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(90deg, transparent, ${BLUE}40)` }}/>
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: MGRAY }}>{belief.eyebrow || "Our Belief"}</p>
        </div>
        <h2 className="text-[48px] lg:text-[64px] xl:text-[72px] font-bold text-[#0B0B0F] leading-[1.06] mb-10" style={serif}>
          {belief.headingLine1 || "We Do Not Start"}<br />{belief.headingLine2 || "With Products."}<br />{belief.headingLine3 || "We Start With"}{" "}
          <span className="relative inline-block" style={{ color: BLUE }}>
            {belief.headingAccent || "Your Life."}
            <span className="absolute left-0 right-0 block rounded-full" style={{ bottom: "-5px", height: "4px", background: GOLD }}/>
          </span>
        </h2>
        <div className="grid lg:grid-cols-2 gap-10 mt-14">
          {beliefParagraphs.map((paragraph) => <p key={paragraph} className="text-[#6B7280] text-[17px] leading-relaxed">{paragraph}</p>)}
        </div>
      </div>
    </section>);
}
// ─── VISION & MISSION ────────────────────────────────────────────────────────
function VisionMission({ content = {} }) {
    const vm = content.visionMission || {};
    return (<section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          <article data-parallax-speed="-0.018" className="gv-parallax rounded-3xl border border-gray-200 p-8 lg:p-10">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: BLUE }}>Our Vision</p>
            <h2 className="text-[32px] sm:text-[40px] font-bold text-[#0B0B0F] leading-tight mb-5" style={serif}>{vm.visionTitle || COMPANY.vision}</h2>
            <p className="text-[#5B6472] leading-7">{vm.visionCopy || "To create a future where people experience wealth not only as financial growth, but also as confidence, freedom, peace of mind and meaningful life opportunities every day."}</p>
          </article>
          <article data-parallax-speed="0.018" className="gv-parallax rounded-3xl border border-white/10 p-8 lg:p-10 text-white" style={{ background: `linear-gradient(135deg, ${BLACK}, #142044)` }}>
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: GOLD }}>Our Mission</p>
            <h2 className="text-[32px] sm:text-[40px] font-bold leading-tight mb-5" style={serif}>{vm.missionTitle || COMPANY.mission}</h2>
            <p className="text-white/70 leading-7">{vm.missionCopy || "To help individuals and families transform their life aspirations into structured financial journeys through disciplined planning, intelligent decision-making and trusted guidance."}</p>
          </article>
        </div>
      </div>
    </section>);
}
// ─── HUMAN GUIDANCE ───────────────────────────────────────────────────────────
const HUMAN_PTS = ["Personal goal understanding", "Family responsibility mapping", "Risk-aware conversations", "Simple financial communication", "Long-term human support"];
const SYSTEM_PTS = ["Investor Assessment", "Bucket List Mapping", "Risk Profile Review", "Goal-Based Plan", "Documentation & Consent", "Monthly Reviews", "Progress Reports", "Next Action Tracking"];
function HumanGuidance() {
    return (<section className="py-28 lg:py-36 bg-[#0B0B0F] relative" style={dotGrid}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 60% at 15% 50%, rgba(31,78,216,0.10) 0%, transparent 70%)` }}/>
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 relative">
        <div className="mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: GOLD }}>Our Approach</p>
          <h2 className="text-[40px] lg:text-[54px] font-bold text-white leading-tight mb-4" style={serif}>
            Human Guidance.<br /><em style={{ color: GOLD, fontStyle: "italic" }}>Intelligent Wealth Structure.</em>
          </h2>
          <p className="text-white/40 text-[16px] max-w-[560px] leading-relaxed">GrowVest combines personal understanding with a disciplined guidance process, so your financial journey is not scattered, emotional, or forgotten.</p>
        </div>
        <div className="grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10">
          <div className="p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10" style={{ background: "rgba(31,78,216,0.07)" }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-6" style={{ background: `${BLUE}25`, color: BLUE, border: `1px solid ${BLUE}40` }}>
              <Users size={11}/> Human Guidance
            </div>
            <p className="text-[21px] font-bold text-white leading-snug mb-4" style={serif}>Money decisions are emotional.</p>
            <p className="text-white/45 leading-relaxed mb-10 text-[15px]">We listen, understand, simplify, and protect your financial priorities with responsibility.</p>
            <ul className="space-y-4">
              {HUMAN_PTS.map((pt, i) => (<li key={pt} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" style={{ background: `${BLUE}30`, color: BLUE, border: `1px solid ${BLUE}60` }}>{i + 1}</div>
                  <span className="text-white/70 text-[14px]">{pt}</span>
                </li>))}
            </ul>
          </div>
          <div className="p-10 lg:p-12" style={{ background: "rgba(245,179,1,0.04)" }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-6" style={{ background: `${GOLD}20`, color: GOLD, border: `1px solid ${GOLD}40` }}>
              <Target size={11}/> Intelligent Structure
            </div>
            <p className="text-[21px] font-bold text-white leading-snug mb-4" style={serif}>Every goal becomes a structured journey.</p>
            <p className="text-white/45 leading-relaxed mb-10 text-[15px]">We turn scattered aspirations into a measurable journey with reviews, reports, and clear next actions.</p>
            <ul className="space-y-0">
              {SYSTEM_PTS.map((pt, i) => (<li key={pt} className="flex items-center gap-4 py-3 border-b border-white/6 last:border-0">
                  <span className="text-[11px] font-bold tabular-nums w-5 flex-shrink-0" style={{ color: `${GOLD}70` }}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-white/70 text-[14px]">{pt}</span>
                </li>))}
            </ul>
          </div>
        </div>
      </div>
    </section>);
}
// ─── WEALTH GUIDANCE BENTO ────────────────────────────────────────────────────
const lightTagStyles = {
    Protect: { background: `${BLUE}12`, color: BLUE },
    Transform: { background: `${GOLD}20`, color: "#92660A" },
    Review: { background: "#E8ECF4", color: MGRAY },
};
const SERVICES = [
    { Icon: Target, title: "Goal-Based Investment Planning", desc: "Every investment anchored to your life goals and personal timeline.", tag: "Protect" },
    { Icon: TrendingUp, title: "SIP & Mutual Fund Guidance", desc: "Structured SIP planning connected to each goal on your roadmap.", tag: "Transform" },
    { Icon: BarChart3, title: "Portfolio Review", desc: "Regular portfolio assessment aligned to your risk profile and goals.", tag: "Review" },
    { Icon: Shield, title: "Insurance Planning", desc: "Protection planning that secures the people and goals that matter most.", tag: "Protect" },
    { Icon: Star, title: "Retirement Planning", desc: "Build a dignified, independent retirement through structured long-term planning.", tag: "Transform" },
    { Icon: GraduationCap, title: "Child Education Planning", desc: "Dedicated planning that protects your child's future with clarity.", tag: "Protect" },
    { Icon: DollarSign, title: "Loan Planning Support", desc: "Structured guidance toward financial freedom and loan closure.", tag: "Review" },
    { Icon: Eye, title: "CIBIL / Credit Health Guidance", desc: "Understanding and improving your credit health as part of a holistic review.", tag: "Review" },
    { Icon: FileText, title: "Tax & Accounting Coordination", desc: "Bringing structure and clarity to your tax planning and financial documents.", tag: "Review" },
    { Icon: Globe, title: "Wealth Diversification Review", desc: "Ensuring your wealth is spread wisely across goals and risk levels.", tag: "Transform" },
];
function WealthGuidanceBento() {
    return (<section className="py-28 lg:py-36 bg-white">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>Wealth Guidance</p>
          <h2 className="text-[40px] lg:text-[52px] font-bold text-[#0B0B0F] leading-tight mb-4" style={serif}>
            Guidance That Protects.<br /><em style={{ fontStyle: "italic", color: BLUE }}>Planning That Transforms.</em>
          </h2>
          <p className="text-[#6B7280] text-[16px] max-w-[540px] mx-auto leading-relaxed">GrowVest supports investors across planning, protection, guidance, review, and coordination — always connected to life goals and suitability.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 p-8 lg:p-10 rounded-3xl flex flex-col justify-between min-h-[260px] group hover:-translate-y-1 transition-all" style={{ background: `linear-gradient(140deg, ${BLUE} 0%, #1A3FB8 100%)`, boxShadow: `0 8px 40px ${BLUE}35` }}>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                <Target size={22} color={WHITE}/>
              </div>
              <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full" style={{ background: "rgba(245,179,1,0.25)", color: GOLD }}>Protect</span>
            </div>
            <div>
              <h3 className="text-[24px] lg:text-[28px] font-bold text-white mb-2 leading-snug" style={serif}>Goal-Based Investment Planning</h3>
              <p className="text-white/60 text-[14px] leading-relaxed">Every investment decision anchored to your life goals and personal timeline — not a product pitch.</p>
            </div>
          </div>
          {SERVICES.slice(1).map(({ Icon, title, desc, tag }) => (<div key={title} className="min-w-0 p-5 lg:p-6 rounded-3xl border hover:border-blue-200 hover:-translate-y-0.5 transition-all group cursor-default" style={{ background: "#F4F6F9", borderColor: "rgba(0,0,0,0.06)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${BLUE}12` }}>
                  <Icon size={18} style={{ color: BLUE }}/>
                </div>
                <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full" style={lightTagStyles[tag]}>{tag}</span>
              </div>
              <h4 className="break-normal font-bold text-[#0B0B0F] text-[13.5px] mb-1.5 leading-snug" style={serif}>{title}</h4>
              <p className="text-[#6B7280] text-[12px] leading-relaxed line-clamp-2">{desc}</p>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── PROGRESS REVIEWS ─────────────────────────────────────────────────────────
const REVIEW_META = [
    { label: "Monthly SIP Review", value: "Active", ok: true },
    { label: "Portfolio Movement", value: "Under Review", ok: null },
    { label: "Pending Action", value: "Insurance Gap Discussion", ok: false },
    { label: "Next Review Date", value: "15 August 2026", ok: null },
];
const HIGHLIGHTS = [
    { label: "Bucket List Progress", Icon: Target }, { label: "Goal-Wise Status", Icon: BarChart3 },
    { label: "Monthly SIP Review", Icon: TrendingUp }, { label: "Portfolio Movement", Icon: FileText },
    { label: "Guide Note", Icon: Users }, { label: "Pending Documents", Icon: Briefcase },
    { label: "Next Action", Icon: ChevronRight }, { label: "Next Review Date", Icon: Calendar },
];
function ProgressReviews() {
    return (<section className="py-28 lg:py-36 bg-[#F4F6F9]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_420px] gap-14 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>Progress Reviews</p>
            <h2 className="text-[40px] lg:text-[52px] font-bold text-[#0B0B0F] leading-tight mb-6" style={serif}>Wealth Should Be<br />Reviewed, Not<br />Forgotten.</h2>
            <p className="text-[#6B7280] text-[16px] leading-relaxed mb-4">Your financial journey deserves regular attention. GrowVest reviews your goals, progress, documents, next steps, and guide notes through a structured review system.</p>
            <p className="text-[#6B7280] text-[15px] leading-relaxed mb-10">Each review is designed to protect your direction, reveal what needs attention, and transform information into clear action.</p>
            <div className="grid grid-cols-2 gap-3">
              {HIGHLIGHTS.map(({ label, Icon }) => (<div key={label} className="flex items-center gap-3 p-3.5 bg-white rounded-2xl" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}15` }}>
                    <Icon size={15} style={{ color: "#92660A" }}/>
                  </div>
                  <span className="text-[#0B0B0F] text-[12.5px] font-semibold leading-tight">{label}</span>
                </div>))}
            </div>
          </div>
          <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 6px 48px rgba(0,0,0,0.10)" }}>
            <div className="px-7 py-5 border-b border-gray-100" style={{ background: `linear-gradient(135deg, ${BLUE}09, ${BLUE}04)` }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full" style={{ background: `linear-gradient(135deg, ${BLUE}, ${GOLD})` }}/>
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: MGRAY }}>GrowVest Guidance</span>
                  </div>
                  <p className="font-bold text-[18px] text-[#0B0B0F]" style={serif}>Monthly Bucket List Review</p>
                  <p className="text-[#6B7280] text-[12px] mt-0.5">Investor: Sample Investor · July 2026</p>
                </div>
                <div className="px-3 py-1.5 rounded-full text-[11px] font-bold" style={{ background: `${GOLD}20`, color: "#92660A", border: `1px solid ${GOLD}35` }}>Active</div>
              </div>
            </div>
            <div className="px-7 py-6 border-b border-gray-100">
              <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#E8ECF4" strokeWidth="6"/>
                    <circle cx="40" cy="40" r="32" fill="none" stroke="url(#pg2)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 32 * 0.42} ${2 * Math.PI * 32 * 0.58}`} transform="rotate(-90 40 40)"/>
                    <defs><linearGradient id="pg2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={BLUE}/><stop offset="100%" stopColor={GOLD}/></linearGradient></defs>
                    <text x="40" y="44" textAnchor="middle" fontSize="14" fontWeight="700" fill={BLUE}>42%</text>
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase mb-0.5" style={{ color: MGRAY }}>Overall Goal Progress</p>
                  <p className="text-[#0B0B0F] font-bold text-[22px]" style={serif}>42% Complete</p>
                  <p className="text-[#6B7280] text-[12px] mt-0.5">4 of 8 goals on track</p>
                </div>
              </div>
            </div>
            <div className="px-7">
              {REVIEW_META.map(({ label, value, ok }) => (<div key={label} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
                  <span className="text-[#6B7280] text-[13px]">{label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: ok === true ? "#059669" : ok === false ? RED : "#374151" }}>{value}</span>
                </div>))}
            </div>
            <div className="px-7 pb-7 pt-2">
              <div className="p-4 rounded-2xl" style={{ background: `${BLUE}07`, border: `1px solid ${BLUE}18` }}>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: BLUE }}>Guide Note</p>
                <p className="text-[#374151] text-[13px] leading-relaxed italic" style={serif}>"Continue SIP discipline and prioritise the family protection coverage review this month."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
// ─── WHY GROWVEST ─────────────────────────────────────────────────────────────
const VALUES = [
    { label: "Boldness", desc: "We guide with clarity when important financial decisions need direction and courage." },
    { label: "Communication", desc: "We simplify financial complexity into clear, understandable steps for every investor." },
    { label: "Accountability", desc: "We take ownership of the guidance journey with discipline, consistency, and responsibility." },
    { label: "Empathy", desc: "We understand the emotions behind money decisions — and meet investors where they are." },
    { label: "Fairness", desc: "We act with transparency, balance, and long-term responsibility in every engagement." },
    { label: "Trust", desc: "We build lasting confidence through consistency, clarity, and sustained care over time." },
];
function WhyGrowVest() {
    return (<section className="py-28 lg:py-36 bg-white">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>Our Values</p>
          <h2 className="text-[40px] lg:text-[52px] font-bold text-[#0B0B0F] leading-tight mb-4" style={serif}>
            Built on Trust.<br /><em style={{ fontStyle: "italic", color: BLUE }}>Designed for Transformation.</em>
          </h2>
          <p className="text-[#6B7280] text-[16px] max-w-[480px] mx-auto leading-relaxed">GrowVest works with clarity, care, and responsibility because financial decisions affect real lives, real families, and real futures.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VALUES.map(({ label, desc }, i) => (<div key={label} className="p-7 lg:p-8 rounded-3xl border border-gray-100 hover:border-yellow-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(31,78,216,0.10)] transition-all group cursor-default" style={{ background: WHITE, boxShadow: "0 2px 20px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: BLUE }}>{String(i + 1).padStart(2, "0")}</div>
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${BLUE}20, transparent)` }}/>
              </div>
              <h4 className="font-bold text-[20px] mb-2 group-hover:text-blue-700 transition-colors" style={{ ...serif, color: BLUE }}>{label}</h4>
              <p className="text-[#6B7280] text-[13.5px] leading-relaxed">{desc}</p>
              <div className="mt-5 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}/>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── COMPARISON ───────────────────────────────────────────────────────────────
const PAIRS = [
    ["Product-first conversation", "Life-goal-first discovery"],
    ["One-time recommendation", "Ongoing progress journey"],
    ["Jargon-heavy advice", "Simple, clear communication"],
    ["Scattered documents", "Structured documentation"],
    ["No regular tracking", "Monthly progress reviews"],
    ["Sales-led follow-up", "Relationship-led guidance"],
    ["Return-focused pitch", "Risk-aware planning"],
];
function ComparisonSection() {
    return (<section className="py-28 lg:py-36 bg-[#F4F6F9]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>A Different Way</p>
          <h2 className="text-[40px] lg:text-[52px] font-bold text-[#0B0B0F] leading-tight" style={serif}>A Different Way to Experience<br />Wealth Guidance.</h2>
        </div>
        <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-gray-100">
            <div className="border-b border-gray-100 px-5 py-4 sm:border-b-0 sm:px-8 sm:py-5 bg-[#F4F6F9]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center"><X size={13} className="text-gray-400"/></div>
                <span className="font-bold text-[#6B7280] text-[15px]" style={serif}>Traditional Finance</span>
              </div>
            </div>
            <div className="px-5 py-4 sm:px-8 sm:py-5" style={{ background: `${BLUE}07` }}>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: BLUE }}><Check size={13} color={WHITE}/></div>
                <span className="font-bold text-[#0B0B0F] text-[15px]" style={serif}>The GrowVest Way</span>
              </div>
            </div>
          </div>
          {PAIRS.map(([t, g], i) => (<div key={i} className="grid grid-cols-1 border-b border-gray-50 last:border-0 sm:grid-cols-2 hover:bg-blue-50/20 transition-colors">
              <div className="flex items-center gap-3 border-b border-gray-100 bg-[#F4F6F9]/40 px-5 py-4 sm:border-b-0 sm:px-8 sm:py-5">
                <X size={12} className="text-gray-300 flex-shrink-0"/><span className="text-[#9CA3AF] text-[13.5px]">{t}</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-4 sm:px-8 sm:py-5">
                <Check size={12} style={{ color: BLUE }} className="flex-shrink-0"/><span className="text-[#0B0B0F] text-[13.5px] font-medium">{g}</span>
              </div>
            </div>))}
        </div>
      </div>
    </section>);
}
// ─── INSIGHTS ─────────────────────────────────────────────────────────────────
function formatInsightDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(new Date(value));
}
async function InsightsPreview() {
    const [{ items }, categories] = await Promise.all([
      listInsights({ publicOnly: true, featuredOnly: false, pageSize: 3 }),
      listCategories(),
    ]);
    const categoryMap = Object.fromEntries(categories.map((item) => [item.id, item]));
    return (<section className="py-28 lg:py-36 bg-white">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-14 gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>Insights</p>
            <h2 className="text-[40px] lg:text-[52px] font-bold text-[#0B0B0F] leading-tight" style={serif}>Insights for Clearer<br />Financial Decisions.</h2>
          </div>
          <Link href="/insights" className="inline-flex items-center gap-2 text-[13.5px] font-semibold group" style={{ color: BLUE }}>
            Explore Insights <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {items.map((post, index) => {
            const category = categoryMap[post.categoryIds?.[0]];
            const color = category?.color || [BLUE, GOLD, "#10B981"][index % 3];
            return (<Link href={`/insights/${post.slug}`} key={post.id} className="group block bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-blue-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="h-[3px]" style={{ background: color }}/>
              <div className="p-7 lg:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color }}>{category?.name || "GrowVest Insight"}</span>
                  <span className="text-gray-200">·</span>
                  <span className="text-[#9CA3AF] text-[12px]">{post.readingTime || 5} min read</span>
                </div>
                <h4 className="font-bold text-[#0B0B0F] text-[19px] mb-5 leading-snug group-hover:text-blue-700 transition-colors" style={serif}>{post.title}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF] text-[12px]">{formatInsightDate(post.publishedAt)}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-0.5 transition-transform" style={{ background: `${color}15` }}>
                    <ArrowRight size={14} style={{ color }}/>
                  </div>
                </div>
                <div className="mt-5 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}/>
              </div>
            </Link>);
          })}
        </div>
      </div>
    </section>);
}
// ─── FINAL CTA ────────────────────────────────────────────────────────────────
function FinalCTA({ content = {} }) {
    const cta = content.finalCta || {};
    return (<section className="relative overflow-hidden border-t border-white/[0.07] py-28 sm:py-32 lg:py-40" style={{ background: BLACK, ...dotGrid }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 52% 60% at 50% 18%, rgba(31,78,216,0.14) 0%, transparent 72%),
                       radial-gradient(ellipse 34% 30% at 50% 100%, rgba(245,179,1,0.055) 0%, transparent 76%)`,
        }}
      />
      <div className="absolute left-1/2 top-0 h-px w-[min(82vw,880px)] -translate-x-1/2 pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${BLUE}80, ${GOLD}55, transparent)` }}/>
      <div className="absolute -left-28 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border border-white/[0.035] pointer-events-none sm:h-80 sm:w-80"/>
      <div className="absolute -right-24 bottom-[-8rem] h-72 w-72 rounded-full border border-white/[0.035] pointer-events-none sm:h-96 sm:w-96"/>

      <div className="relative mx-auto max-w-[800px] px-5 text-center sm:px-8">
        <div className="mb-9 flex items-center justify-center gap-4 sm:mb-10">
          <div className="h-px w-8 sm:w-10" style={{ background: `${GOLD}45` }}/>
          <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: GOLD }}>{cta.eyebrow || "Begin Your Journey"}</span>
          <div className="h-px w-8 sm:w-10" style={{ background: `${GOLD}45` }}/>
        </div>
        <h2 className="mb-6 text-[42px] font-bold leading-[1.04] text-white sm:text-[54px] lg:text-[72px]" style={serif}>
          {cta.headingTop || "Start With a"}<br /><em style={{ fontStyle: "italic", color: GOLD }}>{cta.headingAccent || "Conversation."}</em>
        </h2>
        <p className="mx-auto mb-10 max-w-[560px] text-[16px] leading-relaxed text-white/65 sm:mb-12 sm:text-[17px]">{cta.description || "Your financial journey does not need to begin with confusion. Share your goals with GrowVest, and we will help you see the next right step with clarity."}</p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href={cta.primaryCtaHref || "/contact"} data-analytics-event="primary_cta_click" data-analytics-location="home_final_cta" className="gv-btn-primary inline-flex items-center gap-3">
            {cta.primaryCtaLabel || "Begin Your Journey"} <ArrowRight size={19}/>
          </Link>
          <Link href={cta.secondaryCtaHref || "/your-goals"} data-analytics-event="secondary_cta_click" data-analytics-location="home_final_cta" className="gv-btn-secondary gv-btn-secondary--dark inline-flex items-center gap-2">
            {cta.secondaryCtaLabel || "Explore Your Goals"}
          </Link>
        </div>
      </div>
    </section>);
}
// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function Home({ content = {}, testimonials = [] }) {
    return (<>
      <Hero content={content} />
      <TrustProofStrip content={content} />
      <TrustOperatingSystem />
      <BrandBelief content={content} />
      <HomeBucketListPreview />
      <GrowVestJourney />
      <HumanGuidance />
      <VisionMission content={content} />
      <WealthGuidanceBento />
      <ProgressReviews />
      <WhyGrowVest />
      <ComparisonSection />
      <InvestorTestimonials items={testimonials} location="homepage" />
      <InsightsPreview />
      <FinalCTA content={content} />
    </>);
}
