"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Home as HomeIcon, Plane, Shield, Star, TrendingUp } from "lucide-react";
import { BLACK, BLUE, GOLD, MGRAY, serif, dotGrid } from "../lib/brand";

const JOURNEYS = [
  {
    id: 1,
    tag: "Education",
    headline: "Planning for Three Education Goals with Different Timelines",
    situation: "A family wants to prepare for three children's higher education without treating every goal as one combined corpus.",
    roadmap: "Map each education goal separately, estimate its future cost, identify the timeline and review whether contributions remain aligned as costs and priorities change.",
    target: "Illustrative target: ₹42 lakh",
    color: "#8B5CF6",
    Icon: GraduationCap,
  },
  {
    id: 2,
    tag: "Home",
    headline: "Preparing for a Home While Protecting Long-Term Goals",
    situation: "A couple wants to build a down payment without stopping contributions intended for retirement and family security.",
    roadmap: "Separate the near-term home goal from long-term goals, use appropriate assumptions for each timeline and review the trade-offs before increasing the home budget.",
    target: "Illustrative target: ₹38 lakh",
    color: BLUE,
    Icon: HomeIcon,
  },
  {
    id: 3,
    tag: "Retirement",
    headline: "Turning a Retirement Lifestyle into a Measurable Goal",
    situation: "An individual knows the age at which they want to reduce work, but has not estimated the lifestyle income or long-term corpus required.",
    roadmap: "Define the desired lifestyle, account for inflation and longevity, assess existing savings and create a contribution path that can be reviewed over time.",
    target: "Illustrative target: ₹3.8 crore",
    color: "#10B981",
    Icon: Star,
  },
  {
    id: 4,
    tag: "Protection",
    headline: "Understanding the Gap Between Existing Cover and Family Needs",
    situation: "A family owns several insurance policies but has never compared total cover with liabilities, dependants and income-replacement needs.",
    roadmap: "Review liabilities, family responsibilities, existing cover and emergency liquidity before deciding whether the protection structure needs improvement.",
    target: "Illustrative need: ₹3.8 crore",
    color: "#E53935",
    Icon: Shield,
  },
  {
    id: 5,
    tag: "Experiences",
    headline: "Making a Six-Month Sabbatical Part of the Plan",
    situation: "Two professionals want to travel for six months without using emergency savings or disturbing longer-term priorities.",
    roadmap: "Estimate travel and income-replacement needs, create a dedicated short-term goal and review whether the timeline is realistic before making commitments.",
    target: "Illustrative target: ₹18 lakh",
    color: "#EC4899",
    Icon: Plane,
  },
  {
    id: 6,
    tag: "Wealth",
    headline: "Organising Disconnected Financial Decisions Around Life Goals",
    situation: "A first-generation investor has multiple policies and investments but no clear view of what each holding is intended to achieve.",
    roadmap: "Create a goal map, organise existing holdings by purpose, identify gaps and establish a review rhythm before adding more complexity.",
    target: "Illustrative long-term target: ₹1.1 crore",
    color: GOLD,
    Icon: TrendingUp,
  },
];

const TAGS = ["All", "Education", "Home", "Retirement", "Protection", "Experiences", "Wealth"];

export default function ClientStories() {
  const [active, setActive] = useState("All");
  const filtered = JOURNEYS.filter((journey) => active === "All" || journey.tag === active);

  return (
    <>
      <section className="relative flex min-h-[70vh] items-center overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 60% at 75% 40%, rgba(245,179,1,0.10) 0%, transparent 65%)" }} />
        <div className="relative mx-auto w-full max-w-[1320px] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-[740px]">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px w-8" style={{ background: GOLD }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Illustrative Journeys</span>
            </div>
            <h1 className="mb-6 text-[44px] font-bold leading-[1.04] text-white sm:text-[56px] xl:text-[68px]" style={serif}>
              Real-Life Goals.<br />Structured Thinking.<br /><em style={{ color: GOLD, fontStyle: "italic" }}>Illustrative Roadmaps.</em>
            </h1>
            <p className="max-w-[590px] text-[16px] leading-relaxed text-white/70">
              These examples are educational scenarios created to show how life goals can be organised. They do not represent actual clients, guaranteed outcomes or personalised recommendations.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-[13px] leading-relaxed text-amber-900">
            <strong>Important:</strong> All names, targets and situations on this page are illustrative. Actual requirements depend on income, expenses, existing assets, risk, taxes, inflation, product costs and market conditions.
          </div>
        </div>
      </section>

      <section className="bg-[#F4F6F9] py-20 lg:py-28">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap gap-2" aria-label="Journey categories">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                aria-pressed={active === tag}
                onClick={() => setActive(tag)}
                className="rounded-full border px-4 py-2 text-[13px] font-medium transition-colors"
                style={{ background: active === tag ? BLUE : "white", color: active === tag ? "white" : "#6B7280", borderColor: active === tag ? BLUE : "rgba(0,0,0,0.08)" }}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(({ id, tag, headline, situation, roadmap, target, color, Icon }) => (
              <article key={id} className="overflow-hidden rounded-3xl border border-gray-100 bg-white transition-transform hover:-translate-y-1">
                <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${color}, ${color}60)` }} />
                <div className="p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${color}12` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color }}>{tag}</span>
                  </div>
                  <h2 className="mb-4 text-[18px] font-bold leading-[1.3] text-[#0B0B0F]" style={serif}>{headline}</h2>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: MGRAY }}>Situation</p>
                  <p className="mb-5 text-[13px] leading-relaxed text-[#6B7280]">{situation}</p>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: MGRAY }}>Possible Roadmap</p>
                  <p className="mb-6 text-[13px] leading-relaxed text-[#4B5563]">{roadmap}</p>
                  <div className="rounded-2xl px-4 py-3 text-[13px] font-semibold" style={{ background: `${color}0D`, color }}>{target}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-32 lg:py-40" style={{ background: BLACK, ...dotGrid }}>
        <div className="relative mx-auto max-w-[720px] px-5 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-[42px] font-bold leading-[1.04] text-white lg:text-[58px]" style={serif}>
            Your Journey Begins<br /><em style={{ color: GOLD, fontStyle: "italic" }}>with Your Own Goals.</em>
          </h2>
          <p className="mx-auto mb-10 max-w-[500px] text-[16px] leading-relaxed text-white/70">
            Use these scenarios as inspiration, then begin with your actual priorities, timelines and responsibilities.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact" data-analytics-event="primary_cta_click" data-analytics-location="client_journeys_final" className="gv-btn-primary inline-flex items-center justify-center gap-2.5">
              Begin Your Journey <ArrowRight size={17} />
            </Link>
            <Link href="/your-goals" data-analytics-event="secondary_cta_click" data-analytics-location="client_journeys_final" className="gv-btn-secondary gv-btn-secondary--dark inline-flex items-center justify-center">
              Explore Your Goals
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
