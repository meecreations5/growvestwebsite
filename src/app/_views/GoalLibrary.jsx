"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Home as HomeIcon, Star, Shield, Plane, TrendingUp, Heart, Globe, Check } from "lucide-react";
import { BLUE, BLACK, GOLD, MGRAY, serif, dotGrid } from "../lib/brand";
const GOALS = [
    {
        Icon: GraduationCap, label: "Child Education", color: "#8B5CF6", horizon: "8–18 years", typical: "₹25L – ₹1.2Cr", monthlySip: "₹8,000 – ₹35,000",
        description: "Education costs in India are inflating at 10–12% annually. The gap between what parents estimate and what they need is almost always larger than expected.",
        why: "Starting early and linking a dedicated SIP to this goal — without mixing it with other goals — is the most reliable way to build the corpus without disrupting the plan.",
        keySteps: ["Calculate inflation-adjusted corpus for target institution", "Open a dedicated goal-linked SIP in equity funds (10+ year horizon)", "Review corpus progress annually against fee projections", "Shift to lower-risk instruments 3 years before target year"],
        watchOuts: ["Do not mix with general wealth SIPs — it creates confusion and withdrawal risk", "Underestimating costs by ignoring coaching, laptop, and living expenses", "Pausing SIP during market corrections — this goal cannot afford timing mistakes"],
    },
    {
        Icon: HomeIcon, label: "Dream Home", color: BLUE, horizon: "3–8 years", typical: "₹20L – ₹1.5Cr (down payment)", monthlySip: "₹15,000 – ₹60,000",
        description: "A dream home goal is actually two goals: the down payment (short-to-medium term) and the loan EMI buffer (ongoing). Both need planning separately.",
        why: "Most investors underestimate the total cost — registration, stamp duty, interiors, and moving. We plan for the real number, not just the property price.",
        keySteps: ["Define target property value and required down payment percentage", "Choose appropriate accumulation instruments based on timeline", "Factor in stamp duty (5–7%), registration, and interior costs", "Build a 6-month EMI buffer alongside the down payment corpus"],
        watchOuts: ["Taking a home loan before the corpus is ready can derail other goals", "Using equity funds for a 3-year horizon — too volatile for this timeline", "Ignoring the post-purchase liquidity squeeze on monthly cash flow"],
    },
    {
        Icon: Star, label: "Retirement", color: "#10B981", horizon: "15–30 years", typical: "₹1.5Cr – ₹10Cr+", monthlySip: "₹10,000 – ₹80,000",
        description: "Retirement is the largest corpus most investors will ever build — and the one most frequently underfunded. The goal is a monthly lifestyle income for 25–35 years post-retirement.",
        why: "Starting early is the most powerful lever. ₹10,000/month at 25 creates a fundamentally different retirement corpus than ₹25,000/month at 40 — even with higher contributions.",
        keySteps: ["Define target retirement age and monthly lifestyle income requirement", "Calculate inflation-adjusted corpus using expected real returns", "Maximise equity exposure during accumulation phase (10+ years to retirement)", "Plan systematic withdrawal strategy (SWP) 5 years before retirement"],
        watchOuts: ["Withdrawing from retirement corpus for other goals — it almost never recovers", "Underestimating inflation impact on lifestyle cost 20 years from now", "Ignoring healthcare costs — plan for at least ₹50,000/month in real terms"],
    },
    {
        Icon: Shield, label: "Family Protection", color: "#E53935", horizon: "Active / Ongoing", typical: "₹50L – ₹5Cr (cover)", monthlySip: "₹1,500 – ₹8,000 (premium)",
        description: "Protection is not a goal in the traditional sense — it is the foundation that prevents all other goals from collapsing if something goes wrong.",
        why: "The right protection plan ensures that even in the worst-case scenario, your family's financial goals remain intact. Income replacement, loan closure, and lifestyle continuity — all covered.",
        keySteps: ["Calculate Human Life Value (HLV) to determine required cover", "Add outstanding liabilities to minimum cover requirement", "Choose pure term insurance over traditional policies for maximum cover per rupee", "Review cover every 3 years or after major life events (new child, loan, income change)"],
        watchOuts: ["Traditional insurance plans (LIC endowment, money-back) provide inadequate cover for the premium paid", "Not accounting for outstanding home loan in the cover calculation", "Delaying purchase — every year of delay increases premium significantly"],
    },
    {
        Icon: Plane, label: "Travel & Experiences", color: "#EC4899", horizon: "1–5 years", typical: "₹3L – ₹25L", monthlySip: "₹5,000 – ₹20,000",
        description: "Travel goals are frequently the first to be deferred — and the ones investors most regret not funding. A dedicated travel corpus prevents this pattern.",
        why: "Ring-fencing travel money from general savings ensures the goal is not silently consumed by lifestyle inflation or other expenses. Short timelines demand conservative instruments.",
        keySteps: ["Define specific travel goals: destination, year, and estimated cost", "Use liquid or short-duration debt funds for timelines under 3 years", "Build corpus separately — do not mix with emergency fund or long-term goals", "Review annually as travel costs change with exchange rates and inflation"],
        watchOuts: ["Using credit cards or loans for travel — it converts a joy into a liability", "Mixing travel savings with emergency funds — you will always draw from it", "Setting vague goals ('someday Europe') — specificity is what creates discipline"],
    },
    {
        Icon: TrendingUp, label: "Wealth & Legacy", color: GOLD, horizon: "20–40 years", typical: "₹2Cr – ₹20Cr+", monthlySip: "₹20,000+",
        description: "Building wealth beyond goal-specific corpora — for legacy, philanthropy, or generational transfer — is the aspiration of long-horizon investors.",
        why: "Legacy wealth requires a different framework: not just accumulation, but estate planning, nomination structures, and tax efficiency across generations.",
        keySteps: ["Separate legacy goal corpus from lifestyle and goal-specific corpora", "Structure investments with generational tax efficiency in mind", "Draft a will and set up nomination for all instruments", "Review estate plan every 5 years or after major family events"],
        watchOuts: ["Treating legacy wealth as a residual — 'whatever is left over' rarely compounds well", "No will or nomination clarity — creates family disputes and wealth erosion", "Ignoring estate duty and indexation benefits in long-term planning"],
    },
    {
        Icon: Heart, label: "Health & Care", color: "#F97316", horizon: "Active / Ongoing", typical: "₹15L – ₹1Cr+ (corpus)", monthlySip: "₹5,000 – ₹15,000",
        description: "Healthcare costs are the fastest-inflating category in personal finance — and the most unpredictable. A dedicated health corpus alongside adequate health insurance is essential.",
        why: "Insurance pays for hospitalisation, but pre-hospitalisation, post-care, specialist consultations, and elective procedures often fall outside. A health corpus covers what insurance doesn't.",
        keySteps: ["Ensure adequate health insurance cover — at least ₹25L for a family of 4", "Add a super top-up policy to extend cover cost-effectively", "Build a health corpus in liquid instruments for unplanned medical expenses", "Review insurance adequacy annually — health costs inflate at 12–15%"],
        watchOuts: ["Relying entirely on employer health insurance — it ends with employment", "Setting sum insured based on past hospitalisation costs, not future inflation", "No corpus for critical illness recovery, which can take 6–12 months of income"],
    },
    {
        Icon: Globe, label: "NRI & Global Goals", color: "#14B8A6", horizon: "Varies", typical: "Varies", monthlySip: "Varies",
        description: "NRI investors face a unique set of goal planning challenges — cross-border taxation, currency risk, NRE/NRO account structuring, and India-side goal funding.",
        why: "A well-structured NRI plan links India-side goals (parents' care, home purchase, retirement return) with global income — while coordinating account, tax and legal questions with appropriately qualified professionals.",
        keySteps: ["Map India-specific goals: parent care, property, retirement return timeline", "Structure investments through NRE accounts for tax-free repatriation benefit", "Build a currency hedge for large India-side goals funded from foreign income", "Ensure FEMA compliance for all cross-border transactions"],
        watchOuts: ["Mixing NRE and NRO funds without understanding repatriation limits", "Not updating PAN, Aadhaar, and KYC after becoming an NRI", "Ignoring DTAA (Double Tax Avoidance Agreement) benefits available by country"],
    },
];
export default function GoalLibrary() {
    const [activeGoal, setActiveGoal] = useState(0);
    const goal = GOALS[activeGoal];
    return (<>
      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 55% 55% at 70% 40%, rgba(245,179,1,0.09) 0%, transparent 65%)` }}/>
        <div className="max-w-[1100px] mx-auto px-8 w-full py-20 lg:py-28 relative">
          <div className="max-w-[680px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: GOLD }}/>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>Goal Library</span>
            </div>
            <h1 className="text-[52px] xl:text-[68px] font-bold text-white mb-6 leading-[1.04]" style={serif}>
              Every Goal Has<br />a{" "}
              <em style={{ color: GOLD, fontStyle: "italic" }}>Financial Shape.</em>
            </h1>
            <p className="text-white/40 text-[16px] leading-relaxed max-w-[500px]">
              Explore every major life goal — with corpus benchmarks, SIP ranges, key steps, and the watch-outs most investors miss.
            </p>
          </div>
        </div>
      </section>

      {/* Goal Explorer */}
      <section className="py-20 lg:py-28 bg-[#F4F6F9]">
        <div className="max-w-[1320px] mx-auto px-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar */}
            <div className="space-y-2">
              {GOALS.map(({ Icon, label, color }, i) => (<button type="button" aria-pressed={activeGoal === i} key={label} onClick={() => setActiveGoal(i)} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all" style={{
                background: activeGoal === i ? "white" : "transparent",
                boxShadow: activeGoal === i ? `0 4px 20px ${color}15` : "none",
                border: `1.5px solid ${activeGoal === i ? color : "transparent"}`,
            }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}14` }}>
                    <Icon size={15} style={{ color }}/>
                  </div>
                  <span className="font-semibold text-[14px]" style={{ color: activeGoal === i ? "#0B0B0F" : "#6B7280" }}>{label}</span>
                </button>))}
            </div>

            {/* Detail panel */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between" style={{ background: `${goal.color}06` }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${goal.color}18` }}>
                    <goal.Icon size={22} style={{ color: goal.color }}/>
                  </div>
                  <div>
                    <h2 className="font-bold text-[#0B0B0F] text-[22px]" style={serif}>{goal.label}</h2>
                    <p className="text-[#6B7280] text-[13px]">Goal planning guide</p>
                  </div>
                </div>
                <Link href="/your-goals" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-[13px] font-semibold" style={{ background: goal.color }}>
                  Map This Goal <ArrowRight size={14}/>
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                {[
            { label: "Typical Horizon", value: goal.horizon },
            { label: "Corpus Range", value: goal.typical },
            { label: "Monthly SIP Range", value: goal.monthlySip },
        ].map(({ label, value }) => (<div key={label} className="px-6 py-5">
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: MGRAY }}>{label}</p>
                    <p className="font-bold text-[#0B0B0F] text-[15px]" style={serif}>{value}</p>
                  </div>))}
              </div>

              {/* Body */}
              <div className="p-8 grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: goal.color }}>About This Goal</p>
                    <p className="text-[#4B5563] text-[14px] leading-relaxed">{goal.description}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: goal.color }}>Why It Matters</p>
                    <p className="text-[#4B5563] text-[14px] leading-relaxed">{goal.why}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: goal.color }}>Key Steps</p>
                    <div className="space-y-2.5">
                      {goal.keySteps.map((step, i) => (<div key={i} className="flex gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${goal.color}18` }}>
                            <Check size={10} style={{ color: goal.color }}/>
                          </div>
                          <p className="text-[#374151] text-[13px] leading-relaxed">{step}</p>
                        </div>))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-3 text-[#E53935]">Watch Outs</p>
                    <div className="space-y-2.5">
                      {goal.watchOuts.map((w, i) => (<div key={i} className="flex gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-red-50">
                            <span className="text-[#E53935] text-[9px] font-bold">!</span>
                          </div>
                          <p className="text-[#374151] text-[13px] leading-relaxed">{w}</p>
                        </div>))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-[720px] mx-auto px-8 text-center">
          <h2 className="text-[36px] lg:text-[48px] font-bold text-[#0B0B0F] leading-tight mb-5" style={serif}>
            Ready to Map Your<br />
            <em style={{ fontStyle: "italic", color: BLUE }}>Actual Goals?</em>
          </h2>
          <p className="text-[#6B7280] text-[16px] leading-relaxed mb-10">Build your personalised bucket list and let GrowVest create a financial plan around your specific goals and timelines.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/your-goals" className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full text-white font-semibold text-[15px] transition-all hover:opacity-90" style={{ background: BLUE, boxShadow: `0 8px 32px ${BLUE}45` }}>
              Map Your Bucket List <ArrowRight size={17}/>
            </Link>
            <Link href="/bucket-list-builder" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] border border-gray-200 text-gray-600 transition-all hover:border-blue-200 hover:text-blue-700">
              Try the Builder Tool
            </Link>
          </div>
        </div>
      </section>
    </>);
}
