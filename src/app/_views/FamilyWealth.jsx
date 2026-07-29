import Link from "next/link";
import { ArrowRight, Users, Shield, FileText, Heart, TrendingUp, Check, Globe } from "lucide-react";
import { BLUE, BLACK, GOLD, MGRAY, serif, dotGrid } from "../lib/brand";
const PILLARS = [
    { Icon: Users, color: BLUE, title: "Multi-Generation Goal Mapping", copy: "We map financial goals across two or three generations — your goals, your parents' care, and your children's milestones — as a single integrated plan rather than separate portfolios." },
    { Icon: Shield, color: "#E53935", title: "Family Protection Architecture", copy: "A complete protection review for every member of the family unit — income replacement for earners, health cover, critical illness, and disability planning." },
    { Icon: FileText, color: "#8B5CF6", title: "Estate & Succession Planning", copy: "Wills, nominations, trust structures, and succession clarity — ensuring that wealth transfers to the next generation without disputes, delays, or tax inefficiencies." },
    { Icon: Heart, color: "#EC4899", title: "Parent Care Planning", copy: "A dedicated plan for ageing parents — healthcare corpus, care facility funding, income support — ensuring their needs are met without disrupting the core family financial plan." },
    { Icon: TrendingUp, color: GOLD, title: "Joint Goal Prioritisation", copy: "When a family has competing large goals — home, education, retirement, wedding — we build a sequenced plan that funds each goal in the right order without creating conflicts." },
    { Icon: Globe, color: "#14B8A6", title: "Cross-Border Family Planning", copy: "For families with members working abroad or planning to, we integrate NRI planning, FEMA compliance, and global income into the family's India-side financial structure." },
];
const SCENARIOS = [
    { tag: "Parents + Adult Children", headline: "One Family. Three Earners. Seven Goals. One Plan.", copy: "When multiple family members have separate investments but no coordination, goals compete and wealth is duplicated or wasted. GrowVest maps the entire family as a single financial unit.", color: BLUE },
    { tag: "Joint Family", headline: "A Joint Family Home, Retirement, and Education Goal — All at Once.", copy: "Joint families face competing priorities. We build a sequenced plan that respects each member's goals while coordinating the shared household financial direction.", color: GOLD },
    { tag: "Estate Transfer", headline: "Building Wealth That Survives the Transition.", copy: "Generational wealth transfer benefits from clear nominations, appropriate estate documents and coordinated tax and legal input. GrowVest can help organise the questions and records for discussion with qualified professionals.", color: "#8B5CF6" },
];
export default function FamilyWealth() {
    return (<>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 55% 65% at 20% 50%, rgba(31,78,216,0.15) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 85% 25%, rgba(245,179,1,0.08) 0%, transparent 60%)` }}/>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 w-full py-20 lg:py-32 relative">
          <div className="max-w-[740px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: GOLD }}/>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>Family Wealth</span>
            </div>
            <h1 className="text-[52px] xl:text-[70px] font-bold text-white mb-7 leading-[1.04]" style={serif}>
              Wealth Is Built<br />by Individuals.<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>Preserved by Families.</em>
            </h1>
            <p className="text-white/45 text-[17px] leading-relaxed mb-10 max-w-[560px]">
              GrowVest's family wealth framework coordinates goals, protection, and estate planning across an entire family — not just for one investor in isolation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="gv-btn-primary inline-flex items-center gap-2.5 px-5 sm:px-6 lg:px-8 py-4 rounded-full text-white font-semibold text-[15px] transition-all hover:opacity-90" style={{ background: BLUE, boxShadow: `0 8px 32px ${BLUE}50` }}>
                Begin Your Journey <ArrowRight size={17}/>
              </Link>
              <Link href="/goal-library" className="inline-flex items-center gap-2 px-5 sm:px-6 lg:px-8 py-4 rounded-full font-semibold text-[15px] border transition-all hover:bg-white/5" style={{ borderColor: `${GOLD}45`, color: GOLD }}>
                Explore Goal Types
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why family needs a plan */}
      <section className="py-24 bg-white">
        <div className="max-w-[1000px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-14 items-center">
            <div>
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>The Family Problem</p>
              <h2 className="text-[38px] lg:text-[50px] font-bold text-[#0B0B0F] leading-tight mb-6" style={serif}>
                Most Families Have<br />Portfolios. Not Plans.
              </h2>
              <div className="space-y-4 text-[#4B5563] text-[15px] leading-relaxed">
                <p>Individual family members each invest independently — different funds, different advisors, different goals. Nobody has a view of the whole.</p>
                <p>Goals compete: one member's real estate ambition consumes capital that was silently earmarked for a child's education. A parent's retirement plan is never formalised. Insurance gaps go undetected across the family.</p>
                <p>GrowVest maps the entire family as a single financial unit — with clear roles for each member's goals, a shared protection layer, and a succession plan that works.</p>
              </div>
            </div>

            {/* Visual card */}
            <div className="rounded-3xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.08)" }}>
              <div className="p-6 border-b border-gray-100" style={{ background: `${BLUE}06` }}>
                <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: BLUE }}>A Typical Family We Work With</p>
                <p className="text-[#0B0B0F] font-bold text-[16px]" style={serif}>The Sharma Family · Mumbai</p>
              </div>
              {[
            { member: "Rajesh (48)", role: "Primary earner", goals: "Retirement · Child education", color: BLUE },
            { member: "Priya (44)", role: "Co-earner", goals: "Home renovation · Parents' care", color: GOLD },
            { member: "Aarav (19)", role: "Child / Student", goals: "Postgrad abroad fund", color: "#8B5CF6" },
            { member: "Mr. & Mrs. Sharma Sr.", role: "Parents", goals: "Healthcare · Monthly income", color: "#10B981" },
        ].map(({ member, role, goals, color }) => (<div key={member} className="px-6 py-4 border-b border-gray-50 last:border-0 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${color}14` }}>
                    <span className="text-[11px] font-bold" style={{ color }}>{member[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B0B0F] text-[13px]">{member}</p>
                    <p className="text-[#9CA3AF] text-[11px]">{role}</p>
                    <p className="text-[12px] mt-0.5" style={{ color }}>{goals}</p>
                  </div>
                </div>))}
              <div className="p-5 bg-[#F4F6F9] flex items-center gap-2.5">
                <Check size={13} style={{ color: BLUE }}/>
                <p className="text-[12px] text-[#374151]">One integrated plan. Monthly reviews. All goals tracked.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Pillars */}
      <section className="py-28 lg:py-36 bg-[#F4F6F9]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>The Framework</p>
            <h2 className="text-[36px] lg:text-[50px] font-bold text-[#0B0B0F] leading-tight" style={serif}>
              Six Pillars of the<br />GrowVest Family Plan.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PILLARS.map(({ Icon, color, title, copy }) => (<div key={title} className="p-7 bg-white rounded-3xl border border-gray-100 hover:-translate-y-1 transition-all group" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ background: `${color}12` }}>
                  <Icon size={18} style={{ color }}/>
                </div>
                <h4 className="font-bold text-[#0B0B0F] text-[15px] mb-2.5 leading-snug" style={serif}>{title}</h4>
                <p className="text-[#6B7280] text-[13px] leading-relaxed">{copy}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="py-24 relative" style={{ background: BLACK, ...dotGrid }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 55% 55% at 50% 50%, rgba(31,78,216,0.08) 0%, transparent 70%)` }}/>
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: GOLD }}>Common Scenarios</p>
            <h2 className="text-[34px] lg:text-[46px] font-bold text-white" style={serif}>Which Situation Fits Your Family?</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            {SCENARIOS.map(({ tag, headline, copy, color }) => (<div key={tag} className="p-7 rounded-3xl border border-white/8 hover:border-white/18 hover:-translate-y-1 transition-all" style={{ background: "rgba(255,255,255,0.05)" }}>
                <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full inline-block mb-5" style={{ background: `${color}18`, color }}>{tag}</span>
                <h4 className="font-bold text-white text-[16px] mb-3 leading-snug" style={serif}>{headline}</h4>
                <p className="text-white/40 text-[13px] leading-relaxed">{copy}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-white">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[40px] lg:text-[54px] font-bold text-[#0B0B0F] leading-tight mb-6" style={serif}>
            Build a Plan That<br />
            <em style={{ fontStyle: "italic", color: BLUE }}>Holds the Whole Family.</em>
          </h2>
          <p className="text-[#6B7280] text-[16px] leading-relaxed mb-10">Begin with a family guidance conversation — we will map every member's goals, review your collective protection, and design a plan that serves the whole family, not just one investor.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="gv-btn-primary inline-flex items-center gap-2.5 px-9 py-4 rounded-full text-white font-semibold text-[15px] transition-all hover:opacity-90" style={{ background: BLUE, boxShadow: `0 8px 32px ${BLUE}45` }}>
              Begin Your Journey <ArrowRight size={17}/>
            </Link>
            <Link href="/client-stories" className="inline-flex items-center gap-2 px-5 sm:px-6 lg:px-8 py-4 rounded-full font-semibold text-[15px] border border-gray-200 text-gray-600 transition-all hover:border-blue-200 hover:text-blue-700">
              See Client Stories
            </Link>
          </div>
        </div>
      </section>
    </>);
}
