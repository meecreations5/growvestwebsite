import Link from "next/link";
import { ArrowRight, Quote, ShieldCheck, Sparkles } from "lucide-react";
import { TESTIMONIAL_JOURNEY_TYPES } from "../data/testimonials";

const JOURNEY_LABELS = Object.fromEntries(
  TESTIMONIAL_JOURNEY_TYPES.map((entry) => [entry.value, entry.label]),
);

function normaliseQuote(value) {
  return String(value || "")
    .trim()
    .replace(/^[\s\"“”']+|[\s\"“”']+$/g, "")
    .replace(/\s+/g, " ");
}

function quoteExcerpt(value, limit = 215) {
  const clean = normaliseQuote(value);
  if (clean.length <= limit) return clean;
  const clipped = clean.slice(0, limit);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > limit * 0.72 ? lastSpace : limit).trim()}…`;
}

function InvestorAvatar({ item }) {
  return (
    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#E0E6EF] bg-[#EEF3FF]">
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

function PreviewCard({ item }) {
  const journey = JOURNEY_LABELS[item.journeyType] || "GrowVest Journey";
  const quote = normaliseQuote(item.shortQuote) || quoteExcerpt(item.quote);

  return (
    <article className="flex min-h-[315px] flex-col rounded-[24px] border border-[#E5E9F0] bg-white p-6 shadow-[0_14px_36px_rgba(31,78,216,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(31,78,216,.10)]">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F7FC] text-[#A8B7D2]">
        <Quote size={18} strokeWidth={1.8} />
      </span>

      <blockquote className="mt-6 text-[15px] font-medium leading-7 text-[#252A34]">
        “{quote}”
      </blockquote>

      <div className="mt-auto border-t border-[#EDF0F5] pt-5">
        <div className="flex items-center gap-3">
          <InvestorAvatar item={item} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-[#0B0B0F]">
              {item.displayName || "A GrowVest Investor"}
            </p>
            <p className="mt-1 truncate text-[11px] leading-5 text-[#7A8190]">
              {journey}{item.city ? ` · ${item.city}` : ""}
            </p>
          </div>
          <ShieldCheck size={14} className="shrink-0 text-[#1F4ED8]" aria-label="Consent verified" />
        </div>
      </div>
    </article>
  );
}

export function InvestorTestimonials({ items = [], location = "insights", className = "" }) {
  const visible = items
    .filter((item) => item?.status === "published" && item?.consentConfirmed === true)
    .sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)))
    .slice(0, 3);

  if (!visible.length) return null;

  const sectionBackground = location === "insights" ? "bg-[#F8FAFD]" : "bg-[#F4F6F9]";

  return (
    <section className={`relative overflow-hidden ${sectionBackground} py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1%_100%,rgba(31,78,216,.08),transparent_22%),radial-gradient(circle_at_99%_100%,rgba(245,179,1,.08),transparent_22%)]" />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-md border border-[#F5B301]/55 bg-[#FFFDF7] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#A46F00]">
            <Sparkles size={12} /> Investor experiences
          </span>
          <h2 className="mt-5 font-serif text-4xl font-bold leading-tight text-[#0B0B0F] sm:text-5xl">
            Trusted experiences, shared with care.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-7 text-[#6B7280] sm:text-[15px]">
            Genuine perspectives from investors who chose to bring more structure, confidence and purpose to their financial journey.
          </p>
        </div>

        <div className={`mt-10 grid gap-5 md:grid-cols-2 ${visible.length > 2 ? "xl:grid-cols-3" : "xl:mx-auto xl:max-w-[820px]"}`}>
          {visible.map((item) => <PreviewCard key={item.id} item={item} />)}
        </div>

        <div className="mt-9 flex flex-col items-center gap-4 text-center">
          <Link
            href="/investor-experiences"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1F4ED8] px-6 text-sm font-extrabold text-white transition hover:bg-[#173FB4]"
          >
            View all investor experiences
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <div className="flex max-w-3xl items-start gap-2 text-left text-[10px] leading-5 text-[#7A8190]">
            <ShieldCheck size={13} className="mt-0.5 shrink-0 text-[#1F4ED8]" />
            <p>
              Individual experiences may vary. Testimonials should not be interpreted as a promise of financial outcomes, returns or future performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
