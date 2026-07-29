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

function quoteExcerpt(value, limit = 330) {
  const clean = normaliseQuote(value);
  if (clean.length <= limit) return clean;
  const clipped = clean.slice(0, limit);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > limit * 0.7 ? lastSpace : limit).trim()}…`;
}

function InvestorAvatar({ item }) {
  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#DDE4F2] bg-[#EEF3FF]">
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

export function InvestorTestimonials({ items = [], location = "insights", className = "" }) {
  const visible = items.filter(
    (item) => item?.status === "published" && item?.consentConfirmed === true,
  );

  if (!visible.length) return null;

  const featured = visible.find((item) => item.isFeatured) || visible[0];
  const journey = JOURNEY_LABELS[featured.journeyType] || "GrowVest Journey";
  const featuredQuote = normaliseQuote(featured.shortQuote) || quoteExcerpt(featured.quote, 330);
  const sectionBackground = location === "insights" ? "bg-white" : "bg-[#F4F6F9]";

  return (
    <section className={`${sectionBackground} py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF8E4] text-[#B47E00]">
                <Sparkles size={16} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">
                Investor Experiences
              </span>
            </div>
            <h2 className="mt-6 max-w-xl font-serif text-4xl font-bold leading-tight text-[#0B0B0F] sm:text-5xl">
              Real stories from thoughtful financial journeys.
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-[#6B7280]">
              Read genuine experiences shared with consent by people who chose to bring more structure and clarity to their financial decisions.
            </p>
            <Link
              href="/investor-experiences"
              className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#1F4ED8]"
            >
              Explore Investor Experiences
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <article className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8 lg:p-9">
            <div className="flex items-center justify-between gap-3">
              <Quote size={32} strokeWidth={1.35} className="text-[#F5B301]" />
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7280]">
                <ShieldCheck size={13} className="text-[#1F4ED8]" /> Consent verified
              </span>
            </div>

            <blockquote className="mt-5 font-serif text-[24px] font-bold leading-[1.5] text-[#0B0B0F] sm:text-[29px]">
              “{featuredQuote}”
            </blockquote>

            <div className="mt-7 flex items-center gap-4 border-t border-black/[0.07] pt-6">
              <InvestorAvatar item={featured} />
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-[#0B0B0F]">
                  {featured.displayName || "A GrowVest Investor"}
                </p>
                <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                  {journey}{featured.city ? ` · ${featured.city}` : ""}
                </p>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-5 flex items-start gap-2.5 text-[11px] leading-5 text-[#6B7280]">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#1F4ED8]" />
          <p>
            Individual experiences may vary. Testimonials reflect personal experiences and should not be interpreted as a promise of financial outcomes, returns or future performance.
          </p>
        </div>
      </div>
    </section>
  );
}
