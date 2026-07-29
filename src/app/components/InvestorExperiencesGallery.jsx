"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Quote, ShieldCheck, Sparkles } from "lucide-react";
import { TESTIMONIAL_JOURNEY_TYPES } from "../data/testimonials";
import { serif } from "../lib/brand";

const JOURNEY_LABELS = Object.fromEntries(
  TESTIMONIAL_JOURNEY_TYPES.map((entry) => [entry.value, entry.label]),
);

function normaliseQuote(value) {
  return String(value || "")
    .trim()
    .replace(/^[\s\"“”']+|[\s\"“”']+$/g, "")
    .replace(/\s+/g, " ");
}

function quoteExcerpt(value, limit = 275) {
  const clean = normaliseQuote(value);
  if (clean.length <= limit) return clean;
  const clipped = clean.slice(0, limit);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > limit * 0.72 ? lastSpace : limit).trim()}…`;
}

function InvestorPortrait({ item }) {
  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#E0E6EF] bg-[#EEF3FF]">
      {item.photo?.url && !item.useInitials ? (
        <img
          src={item.photo.url}
          alt={item.photo.altText || ""}
          className="h-full w-full object-cover"
          style={{ objectPosition: `${item.photo.focalX ?? 50}% ${item.photo.focalY ?? 50}%` }}
          loading="lazy"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs font-extrabold tracking-[0.08em] text-[#1F4ED8]">
          {item.initials || "GV"}
        </div>
      )}
    </div>
  );
}

function ExperienceCard({ item, featured = false }) {
  const [expanded, setExpanded] = useState(false);
  const fullQuote = normaliseQuote(item.quote || item.shortQuote);
  const cardQuote = normaliseQuote(item.shortQuote) || quoteExcerpt(fullQuote);
  const hasMore = fullQuote.length > cardQuote.length + 12;
  const journey = JOURNEY_LABELS[item.journeyType] || "GrowVest Journey";

  return (
    <article className="flex min-h-[360px] flex-col rounded-[26px] border border-[#E5E9F0] bg-white p-6 shadow-[0_16px_42px_rgba(31,78,216,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(31,78,216,.11)] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F7FC] text-[#A8B7D2]">
          <Quote size={20} strokeWidth={1.8} />
        </span>
        {featured ? (
          <span className="rounded-full border border-[#F5B301]/35 bg-[#FFF9E8] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#A46F00]">
            Featured
          </span>
        ) : null}
      </div>

      <blockquote className="mt-7 text-[15px] font-medium leading-7 text-[#252A34] sm:text-[16px]">
        “{expanded ? fullQuote : cardQuote}”
      </blockquote>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-extrabold text-[#1F4ED8] transition hover:text-[#173FB4]"
        >
          {expanded ? "Show less" : "Read full experience"}
          <ArrowRight size={13} className={expanded ? "rotate-[-90deg]" : ""} />
        </button>
      ) : null}

      <div className="mt-auto border-t border-[#EDF0F5] pt-5">
        <div className="flex items-center gap-3">
          <InvestorPortrait item={item} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-[#0B0B0F]">
              {item.displayName || "A GrowVest Investor"}
            </p>
            <p className="mt-1 truncate text-[11px] leading-5 text-[#7A8190]">
              {journey}{item.city ? ` · ${item.city}` : ""}
            </p>
          </div>
          <ShieldCheck size={15} className="shrink-0 text-[#1F4ED8]" aria-label="Consent verified" />
        </div>
      </div>
    </article>
  );
}

export function InvestorExperiencesGallery({ items = [] }) {
  const published = useMemo(
    () => items.filter((item) => item?.status === "published" && item?.consentConfirmed === true),
    [items],
  );
  const [activeJourney, setActiveJourney] = useState("all");

  const journeyOptions = useMemo(() => {
    const values = new Set(published.map((item) => item.journeyType).filter(Boolean));
    return TESTIMONIAL_JOURNEY_TYPES.filter((entry) => values.has(entry.value));
  }, [published]);

  const visible = activeJourney === "all"
    ? published
    : published.filter((item) => item.journeyType === activeJourney);

  return (
    <>
      <section className="relative overflow-hidden bg-white pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgba(245,179,1,.10),transparent_30%),radial-gradient(circle_at_92%_18%,rgba(31,78,216,.10),transparent_32%)]" />
        <div className="relative mx-auto max-w-[980px] px-5 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-md border border-[#F5B301]/55 bg-[#FFFDF7] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#A46F00]">
            <Sparkles size={12} /> Investor experiences
          </span>
          <h1
            className="mx-auto mt-6 max-w-4xl text-[42px] font-bold leading-[1.08] text-[#0B0B0F] sm:text-[54px] lg:text-[64px]"
            style={serif}
          >
            Real stories. Thoughtful financial journeys.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-8 text-[#6B7280] sm:text-[17px]">
            Genuine experiences shared by investors who chose to bring greater clarity, structure and confidence to important financial decisions.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[10px] font-bold uppercase tracking-[0.11em] text-[#7A8190]">
            <span className="inline-flex items-center gap-2"><Check size={13} className="text-[#1F4ED8]" /> Written consent</span>
            <span className="inline-flex items-center gap-2"><Check size={13} className="text-[#1F4ED8]" /> Genuine experiences</span>
            <span className="inline-flex items-center gap-2"><Check size={13} className="text-[#1F4ED8]" /> No outcome promises</span>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#F4F7FB] py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_2%_100%,rgba(31,78,216,.10),transparent_24%),radial-gradient(circle_at_98%_100%,rgba(229,57,53,.07),transparent_24%)]" />
        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#1F4ED8]">Shared with trust</p>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#0B0B0F] sm:text-5xl">
              Experiences that reflect clarity and care.
            </h2>
          </div>

          {journeyOptions.length > 1 ? (
            <div className="mt-8 flex gap-2 overflow-x-auto pb-2 sm:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filter investor experiences by journey">
              <button
                type="button"
                onClick={() => setActiveJourney("all")}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${activeJourney === "all" ? "bg-[#1F4ED8] text-white shadow-sm" : "border border-[#DFE5EE] bg-white text-[#667085] hover:border-[#B9C7DD]"}`}
              >
                All Experiences
              </button>
              {journeyOptions.map((entry) => (
                <button
                  type="button"
                  key={entry.value}
                  onClick={() => setActiveJourney(entry.value)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${activeJourney === entry.value ? "bg-[#1F4ED8] text-white shadow-sm" : "border border-[#DFE5EE] bg-white text-[#667085] hover:border-[#B9C7DD]"}`}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          ) : null}

          {visible.length ? (
            <div className={`mt-10 grid gap-5 md:grid-cols-2 ${visible.length > 2 ? "xl:grid-cols-3" : "xl:mx-auto xl:max-w-[820px]"}`}>
              {visible.map((item, index) => (
                <ExperienceCard key={item.id} item={item} featured={item.isFeatured || index === 0} />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-10 max-w-2xl rounded-[26px] border border-[#E5E9F0] bg-white px-6 py-14 text-center shadow-sm">
              <Sparkles size={28} className="mx-auto text-[#F5B301]" />
              <h3 className="mt-5 font-serif text-3xl font-bold text-[#0B0B0F]">Investor experiences will appear here.</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6B7280]">
                A testimonial is displayed only after written consent and internal review.
              </p>
            </div>
          )}

          <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-5 rounded-[22px] border border-[#E1E7F0] bg-white/80 p-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF3FF] text-[#1F4ED8]">
                <ShieldCheck size={16} />
              </span>
              <p className="text-[11px] leading-6 text-[#6B7280]">
                Individual experiences may vary. Testimonials reflect personal experiences and should not be interpreted as a promise of financial outcomes, returns or future performance.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#1F4ED8] px-5 text-xs font-extrabold text-white transition hover:bg-[#173FB4]"
            >
              Begin Your Journey
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
