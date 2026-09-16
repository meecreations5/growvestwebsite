"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass, Eye, Map, RefreshCw, Sparkles, Target } from "lucide-react";
import { GrowVestMark } from "./GrowVestMark";
import { trackEvent } from "../lib/analytics";

const STEPS = [
  {
    Icon: Eye,
    title: "Understand Your Life",
    copy: "We begin with the people, responsibilities, priorities and experiences that shape your financial decisions.",
    note: "Discovery and context",
  },
  {
    Icon: Compass,
    title: "Map Your Goals",
    copy: "Your bucket list becomes a clear map of near-term needs, long-term aspirations and the milestones between them.",
    note: "Goal and priority mapping",
  },
  {
    Icon: Map,
    title: "Build the Financial Journey",
    copy: "We bring structure to the information, assumptions and possible next steps so the path feels understandable and purposeful.",
    note: "Clarity and structured direction",
  },
  {
    Icon: RefreshCw,
    title: "Review Your Progress",
    copy: "Regular conversations help you recognise progress, address pending actions and keep changing life priorities visible.",
    note: "Accountability and review",
  },
  {
    Icon: Sparkles,
    title: "Experience Wealth Meaningfully",
    copy: "The purpose is not only to accumulate more, but to experience greater confidence, freedom and possibility throughout the journey.",
    note: "Security, freedom and experience",
  },
];

export function GrowVestJourney() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef([]);
  const viewedRef = useRef(new Set());

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = stepRefs.current.filter(Boolean);
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));

        if (!visibleEntries.length) return;
        const index = Number(visibleEntries[0].target.dataset.journeyIndex || 0);
        setActive(index);

        if (!viewedRef.current.has(index)) {
          viewedRef.current.add(index);
          trackEvent("journey_step_view", { step_number: index + 1, step_name: STEPS[index].title });
        }
      },
      { threshold: reducedMotion ? 0.15 : 0.42, rootMargin: "-18% 0px -34% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const progress = STEPS.length > 1 ? active / (STEPS.length - 1) : 0;

  return (
    <section className="bg-[#F4F6F9] py-24 lg:py-32" id="growvest-journey">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[390px_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#6B7280]">The GrowVest Journey</p>
            <h2 className="font-serif text-[38px] font-bold leading-tight text-[#0B0B0F] sm:text-[46px] lg:text-[52px]">
              From life goals to meaningful wealth progress.
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-[#6B7280]">
              A conscious wealth journey should feel connected. Scroll through the five stages that bring purpose, clarity and accountability together.
            </p>

            <div className="mt-10 hidden items-center gap-5 lg:flex">
              <div className="relative h-[230px] w-14">
                <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-[#D9DEE8]" />
                <div className="absolute left-1/2 top-0 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#1F4ED8] to-[#F5B301] transition-[height] duration-500" style={{ height: `${Math.max(6, progress * 100)}%` }} />
                <div className="absolute left-1/2 w-11 -translate-x-1/2 transition-[top] duration-500" style={{ top: `calc(${progress * 100}% - 14px)` }}>
                  <GrowVestMark ambient decorative className="h-auto w-full" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1F4ED8]">Stage {String(active + 1).padStart(2, "0")}</p>
                <p className="mt-2 font-serif text-[20px] font-bold text-[#0B0B0F]">{STEPS[active].title}</p>
                <p className="mt-1 text-[12px] text-[#6B7280]">{STEPS[active].note}</p>
              </div>
            </div>

            <Link href="/the-growvest-way" className="gv-btn-secondary mt-9 inline-flex items-center gap-2">
              Explore the GrowVest Way <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-5">
            {STEPS.map(({ Icon, title, copy, note }, index) => {
              const isActive = active === index;
              return (
                <article
                  key={title}
                  ref={(node) => { stepRefs.current[index] = node; }}
                  data-journey-index={index}
                  className={`relative overflow-hidden rounded-[30px] border p-7 transition-all duration-500 sm:p-9 lg:min-h-[255px] ${
                    isActive
                      ? "border-[#1F4ED8]/35 bg-[#0B0B0F] text-white shadow-[0_22px_70px_rgba(31,78,216,0.16)]"
                      : "border-black/[0.06] bg-white text-[#0B0B0F]"
                  }`}
                >
                  <div className="pointer-events-none absolute right-6 top-3 font-serif text-[76px] font-bold leading-none opacity-[0.045] sm:text-[100px]">{String(index + 1).padStart(2, "0")}</div>
                  <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
                    <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${isActive ? "bg-[#1F4ED8]/25 text-[#8FA8FF]" : "bg-[#1F4ED8]/10 text-[#1F4ED8]"}`}>
                      <Icon size={23} aria-hidden="true" />
                    </div>
                    <div>
                      <p className={`mb-2 text-[10px] font-bold uppercase tracking-[0.18em] ${isActive ? "text-[#F5B301]" : "text-[#6B7280]"}`}>Stage {String(index + 1).padStart(2, "0")} · {note}</p>
                      <h3 className="font-serif text-[25px] font-bold leading-tight sm:text-[29px]">{title}</h3>
                      <p className={`mt-4 max-w-[620px] text-[14px] leading-relaxed ${isActive ? "text-white/70" : "text-[#6B7280]"}`}>{copy}</p>
                    </div>
                  </div>
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#1F4ED8] to-[#F5B301] transition-[width] duration-700 ${isActive ? "w-full" : "w-0"}`} />
                </article>
              );
            })}

            <div className="flex items-center gap-4 rounded-3xl border border-[#1F4ED8]/15 bg-[#1F4ED8]/[0.055] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5B301]/15 text-[#A87500]">
                <Target size={19} aria-hidden="true" />
              </div>
              <p className="text-[13px] leading-relaxed text-[#4B5563]">
                Every journey is personal. The stages create structure, while your circumstances, priorities and decisions shape the path.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
