"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Quote, ShieldCheck, Sparkles } from "lucide-react";
import { TESTIMONIAL_JOURNEY_TYPES } from "../data/testimonials";
import { BLACK, GOLD, dotGrid, serif } from "../lib/brand";

const JOURNEY_LABELS = Object.fromEntries(
  TESTIMONIAL_JOURNEY_TYPES.map((entry) => [entry.value, entry.label]),
);

function normaliseQuote(value) {
  return String(value || "")
    .trim()
    .replace(/^[\s\"“”']+|[\s\"“”']+$/g, "")
    .replace(/\s+/g, " ");
}

function quoteExcerpt(value, limit = 320) {
  const clean = normaliseQuote(value);
  if (clean.length <= limit) return clean;
  const clipped = clean.slice(0, limit);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > limit * 0.7 ? lastSpace : limit).trim()}…`;
}

function InvestorPortrait({ item, large = false }) {
  const size = large ? "h-14 w-14" : "h-11 w-11";

  return (
    <div className={`${size} shrink-0 overflow-hidden rounded-full border border-[#DDE4F2] bg-[#EEF3FF]`}>
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

function Identity({ item }) {
  const journey = JOURNEY_LABELS[item.journeyType] || "GrowVest Journey";

  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-extrabold text-[#0B0B0F]">
        {item.displayName || "A GrowVest Investor"}
      </p>
      <p className="mt-1 text-xs leading-5 text-[#6B7280]">
        {journey}{item.city ? ` · ${item.city}` : ""}
      </p>
    </div>
  );
}

function FeaturedExperience({ item }) {
  const [expanded, setExpanded] = useState(false);
  const fullQuote = normaliseQuote(item.quote || item.shortQuote);
  const shortQuote = normaliseQuote(item.shortQuote) || quoteExcerpt(fullQuote, 430);
  const hasMore = fullQuote.length > shortQuote.length + 12;

  return (
    <article className="mx-auto max-w-5xl rounded-3xl border border-[#E3E7EF] bg-white p-6 shadow-[0_14px_44px_rgba(11,11,15,.06)] sm:p-8 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF3FF] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#1F4ED8]">
          <Sparkles size={12} /> Featured experience
        </span>
        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7280]">
          <ShieldCheck size={13} className="text-[#1F4ED8]" /> Consent verified
        </span>
      </div>

      <Quote size={34} strokeWidth={1.35} className="mt-7 text-[#F5B301]" />
      <blockquote className="mt-4 max-w-4xl font-serif text-[25px] font-bold leading-[1.46] text-[#0B0B0F] sm:text-[30px] lg:text-[34px]">
        “{expanded ? fullQuote : shortQuote}”
      </blockquote>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-[#1F4ED8] transition hover:text-[#173FB4]"
        >
          {expanded ? "Show less" : "Read complete experience"}
          <ArrowRight size={14} />
        </button>
      ) : null}

      <div className="mt-8 flex flex-col gap-4 border-t border-[#E8ECF3] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <InvestorPortrait item={item} large />
          <Identity item={item} />
        </div>
        <p className="text-[11px] leading-5 text-[#6B7280]">Shared with written consent</p>
      </div>
    </article>
  );
}

function StoryCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const fullQuote = normaliseQuote(item.quote || item.shortQuote);
  const shortQuote = normaliseQuote(item.shortQuote) || quoteExcerpt(fullQuote, 250);
  const hasMore = fullQuote.length > shortQuote.length + 12;

  return (
    <article className="flex min-h-[320px] flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(11,11,15,.08)] sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-[#1F4ED8]/8 px-3 py-1.5 text-[10px] font-bold text-[#1F4ED8]">
          {JOURNEY_LABELS[item.journeyType] || "GrowVest Journey"}
        </span>
        <ShieldCheck size={15} className="text-[#1F4ED8]" aria-label="Consent verified" />
      </div>

      <Quote size={26} strokeWidth={1.45} className="mt-7 text-[#F5B301]" />
      <blockquote className="mt-4 font-serif text-[21px] font-bold leading-[1.52] text-[#0B0B0F] sm:text-[23px]">
        “{expanded ? fullQuote : shortQuote}”
      </blockquote>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-4 inline-flex w-fit items-center gap-2 text-xs font-extrabold text-[#1F4ED8] hover:text-[#173FB4]"
        >
          {expanded ? "Show less" : "Read more"}
          <ArrowRight size={13} />
        </button>
      ) : null}

      <div className="mt-auto flex items-center gap-3 border-t border-black/[0.07] pt-5">
        <InvestorPortrait item={item} />
        <Identity item={item} />
      </div>
    </article>
  );
}

export function InvestorExperiencesGallery({ items = [] }) {
  const published = useMemo(
    () => items.filter((item) => item?.status === "published" && item?.consentConfirmed === true),
    [items],
  );
  const featured = published.find((item) => item.isFeatured) || published[0] || null;
  const remaining = useMemo(
    () => published.filter((item) => !featured || item.id !== featured.id),
    [published, featured],
  );
  const [activeJourney, setActiveJourney] = useState("all");

  const journeyOptions = useMemo(() => {
    const values = new Set(remaining.map((item) => item.journeyType).filter(Boolean));
    return TESTIMONIAL_JOURNEY_TYPES.filter((entry) => values.has(entry.value));
  }, [remaining]);

  const visible = activeJourney === "all"
    ? remaining
    : remaining.filter((item) => item.journeyType === activeJourney);

  return (
    <>
      <section
        className="relative flex min-h-[58vh] items-end overflow-hidden"
        style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 80% 28%, rgba(31,78,216,.17), transparent 68%), radial-gradient(ellipse 32% 42% at 10% 82%, rgba(245,179,1,.07), transparent 65%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-[1320px] px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-8" style={{ background: GOLD }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
                Investor Experiences
              </span>
            </div>
            <h1 className="text-[42px] font-bold leading-[1.04] text-white sm:text-[54px] xl:text-[68px]" style={serif}>
              Real journeys.<br />Thoughtful <em className="italic" style={{ color: GOLD }}>progress.</em>
            </h1>
            <p className="mt-7 max-w-2xl text-[16px] leading-8 text-white/60">
              Genuine experiences shared by investors who chose to bring greater clarity, structure and purpose to their financial journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-bold uppercase tracking-[0.11em] text-white/45">
              <span className="inline-flex items-center gap-2"><Check size={13} className="text-[#F5B301]" /> Written consent</span>
              <span className="inline-flex items-center gap-2"><Check size={13} className="text-[#F5B301]" /> Genuine experiences</span>
              <span className="inline-flex items-center gap-2"><Check size={13} className="text-[#F5B301]" /> No outcome promises</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
          <div className="mb-9 max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Featured experience</p>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#0B0B0F] sm:text-5xl">
              A personal perspective on financial clarity.
            </h2>
          </div>

          {featured ? (
            <FeaturedExperience item={featured} />
          ) : (
            <div className="rounded-3xl border border-[#E3E7EF] bg-[#F8F9FC] px-6 py-14 text-center">
              <Sparkles size={28} className="mx-auto text-[#F5B301]" />
              <h2 className="mt-5 font-serif text-3xl font-bold text-[#0B0B0F]">Investor experiences will appear here.</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6B7280]">
                A testimonial is displayed only after written consent and internal review.
              </p>
            </div>
          )}
        </div>
      </section>

      {remaining.length ? (
        <section className="bg-[#F4F6F9] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">More journeys</p>
                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight text-[#0B0B0F] sm:text-5xl">
                  Different goals. One shared desire for clarity.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#6B7280] lg:text-right">
                Experiences may be edited for clarity and length without changing their intended meaning.
              </p>
            </div>

            {journeyOptions.length > 1 ? (
              <div className="mt-7 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filter investor experiences by journey">
                <button
                  type="button"
                  onClick={() => setActiveJourney("all")}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${activeJourney === "all" ? "bg-[#1F4ED8] text-white" : "border border-gray-200 bg-white text-[#6B7280]"}`}
                >
                  All Experiences
                </button>
                {journeyOptions.map((entry) => (
                  <button
                    type="button"
                    key={entry.value}
                    onClick={() => setActiveJourney(entry.value)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${activeJourney === entry.value ? "bg-[#1F4ED8] text-white" : "border border-gray-200 bg-white text-[#6B7280]"}`}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            ) : null}

            {visible.length ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visible.map((item) => <StoryCard key={item.id} item={item} />)}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-[#E3E7EF] bg-white px-6 py-14 text-center">
                <Sparkles size={28} className="mx-auto text-[#F5B301]" />
                <h3 className="mt-5 font-serif text-3xl font-bold text-[#0B0B0F]">No experiences in this category yet.</h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6B7280]">Choose another journey to continue exploring.</p>
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-6 rounded-3xl border border-[#E3E7EF] bg-[#F8F9FC] p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EEF3FF] text-[#1F4ED8]">
                <ShieldCheck size={18} />
              </span>
              <div>
                <p className="text-sm font-extrabold text-[#0B0B0F]">A note on investor experiences</p>
                <p className="mt-2 max-w-3xl text-xs leading-6 text-[#6B7280]">
                  Individual experiences may vary. Testimonials reflect personal experiences and should not be interpreted as a promise of financial outcomes, returns or future performance. GrowVest publishes testimonials only after recorded consent.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="group inline-flex h-[50px] w-full items-center justify-center gap-3 rounded-full bg-[#1F4ED8] px-6 text-sm font-extrabold text-white transition hover:bg-[#173FB4] sm:w-fit"
            >
              Begin Your Journey
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
