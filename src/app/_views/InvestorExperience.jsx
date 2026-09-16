"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Clock3,
  Compass,
  FileText,
  GraduationCap,
  HeartHandshake,
  Home,
  Link2,
  ListChecks,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Milestone,
  Plane,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Telescope,
  TrendingUp,
  Users,
} from "lucide-react";
import { BLACK, BLUE, COMPANY, GOLD, GRAY, serif, dotGrid } from "../lib/brand";
import { trackEvent } from "../lib/analytics";

const CLARITY_OPTIONS = [
  "Organising my financial goals",
  "Understanding my current financial picture",
  "Planning future milestones",
  "Connecting my wealth with my Bucket List",
  "Understanding the GrowVest approach",
  "Something else",
];

const MILESTONES = [
  {
    Icon: Home,
    title: "A home",
    shortTitle: "Home",
    story: "The goal may be the home. The reason may be stability, family or belonging.",
  },
  {
    Icon: Plane,
    title: "Travel and experiences",
    shortTitle: "Experiences",
    story: "The goal may be the journey. The reason may be time together or an experience you have always wanted.",
  },
  {
    Icon: GraduationCap,
    title: "Children's milestones",
    shortTitle: "Children",
    story: "The number may represent education or a milestone. Behind it is the future you want to support.",
  },
  {
    Icon: HeartHandshake,
    title: "Family responsibilities",
    shortTitle: "Family",
    story: "Some goals are about the people who depend on you and the responsibilities you want to meet with clarity.",
  },
  {
    Icon: Clock3,
    title: "More freedom over your time",
    shortTitle: "Freedom",
    story: "The financial goal may be a corpus. The life goal may be more choice over how you spend your time.",
  },
  {
    Icon: Telescope,
    title: "Retirement and the years ahead",
    shortTitle: "Years Ahead",
    story: "The goal may be retirement. The reason may be greater freedom, confidence and continuity in the years ahead.",
  },
  {
    Icon: Sparkles,
    title: "Personal aspirations",
    shortTitle: "Aspirations",
    story: "Some milestones are deeply personal. Your wealth journey should still leave room for what matters uniquely to you.",
  },
];

const APPROACH_STEPS = [
  { Icon: Search, number: "01", title: "Discover", copy: "Understand where you are today." },
  { Icon: Target, number: "02", title: "Define", copy: "Identify the milestones and experiences that matter to you." },
  { Icon: Compass, number: "03", title: "Design", copy: "Build a pathway around those priorities." },
  { Icon: TrendingUp, number: "04", title: "Track", copy: "Stay connected with your progress." },
  { Icon: Sparkles, number: "05", title: "Celebrate", copy: "Recognise the milestones along the journey." },
];

const APP_FEATURES = [
  {
    key: "portfolio",
    Icon: BriefcaseBusiness,
    title: "Investments",
    copy: "A clearer view of investments and portfolio information.",
    screens: ["portfolio", "home"],
  },
  {
    key: "bucket-list",
    Icon: ListChecks,
    title: "Bucket List & Goals",
    copy: "Stay connected with the milestones you are building towards.",
    screens: ["bucket-list", "home"],
  },
  {
    key: "monthly-review",
    Icon: FileText,
    title: "Reports & Reviews",
    copy: "Access important reports and review information more easily.",
    screens: ["monthly-review", "home"],
  },
  {
    key: "home",
    Icon: MessageSquareText,
    title: "Connected Experience",
    copy: "Stay connected with your journey and interactions with GrowVest.",
    screens: ["home", "monthly-review"],
  },
];

const APP_SCREENS = {
  home: {
    src: "/campaign/investor-experience/home.jpg",
    alt: "GrowVest Investor App home dashboard",
    width: 540,
    height: 1407,
    topCropPercent: 4.25,
  },
  portfolio: {
    src: "/campaign/investor-experience/portfolio.jpg",
    alt: "GrowVest Investor App portfolio screen",
    width: 385,
    height: 1600,
    topCropPercent: 2.75,
  },
  "bucket-list": {
    src: "/campaign/investor-experience/bucket-list.jpg",
    alt: "GrowVest Investor App Bucket List screen",
    width: 540,
    height: 1527,
    topCropPercent: 4.1,
  },
  "monthly-review": {
    src: "/campaign/investor-experience/monthly-review.jpg",
    alt: "GrowVest Investor App monthly review screen",
    width: 385,
    height: 1600,
    topCropPercent: 2.7,
  },
};

const PILLARS = [
  { Icon: Search, title: "Clarity", copy: "Understand where you are." },
  { Icon: Compass, title: "Purpose", copy: "Stay connected with what you are building towards." },
  { Icon: Link2, title: "Connection", copy: "Keep your wealth journey and important milestones closer together." },
];

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const CAMPAIGN_STORAGE_KEY = "growvest_investor_experience_campaign";

function readCampaignAttribution() {
  if (typeof window === "undefined") {
    return { source: "", medium: "", campaign: "", term: "", content: "" };
  }

  let stored = {};
  try {
    stored = JSON.parse(window.sessionStorage.getItem(CAMPAIGN_STORAGE_KEY) || "{}") || {};
  } catch {
    stored = {};
  }

  const search = new URLSearchParams(window.location.search);
  const incoming = Object.fromEntries(UTM_KEYS.map((key) => [key, search.get(key) || ""]));
  const merged = {
    utm_source: incoming.utm_source || stored.utm_source || "",
    utm_medium: incoming.utm_medium || stored.utm_medium || "",
    utm_campaign: incoming.utm_campaign || stored.utm_campaign || "",
    utm_term: incoming.utm_term || stored.utm_term || "",
    utm_content: incoming.utm_content || stored.utm_content || "",
  };

  if (Object.values(merged).some(Boolean)) {
    try {
      window.sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // Browsing continues normally when storage is unavailable.
    }
  }

  return {
    source: merged.utm_source,
    medium: merged.utm_medium,
    campaign: merged.utm_campaign,
    term: merged.utm_term,
    content: merged.utm_content,
  };
}

function SectionEyebrow({ children, dark = false, center = false }) {
  return (
    <div className={`mb-5 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
      <span className="h-px w-8" style={{ background: GOLD }} />
      <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${dark ? "text-white/65" : "text-[#6B7280]"}`}>
        {children}
      </span>
    </div>
  );
}

function PhoneFrame({ screenKey, className = "", priority = false, emphasis = true }) {
  const screen = APP_SCREENS[screenKey];
  return (
    <div
      className={`relative aspect-[0.48] overflow-hidden rounded-[2.15rem] border border-white/14 bg-[#e9edf5] p-[6px] shadow-[0_28px_80px_rgba(0,0,0,0.34)] transition-all duration-500 sm:rounded-[2.55rem] sm:p-[7px] ${emphasis ? "opacity-100" : "opacity-45 saturate-[0.75]"} ${className}`}
    >
      <div className="relative h-full overflow-hidden rounded-[1.82rem] bg-white sm:rounded-[2.15rem]">
        <Image
          src={screen.src}
          alt={screen.alt}
          width={screen.width}
          height={screen.height}
          priority={priority}
          unoptimized
          draggable={false}
          sizes="(max-width: 640px) 52vw, 250px"
          className="pointer-events-none block h-auto w-full max-w-none select-none"
          style={{ transform: `translateY(-${screen.topCropPercent || 0}%)` }}
        />
      </div>
    </div>
  );
}

function HeroJourneyVisual() {
  const chips = [
    { label: "A home", x: "4%", y: "18%", accent: GOLD },
    { label: "Experiences", x: "53%", y: "4%", accent: BLUE },
    { label: "Family", x: "68%", y: "64%", accent: GOLD },
    { label: "Freedom", x: "2%", y: "68%", accent: BLUE },
  ];

  return (
    <div className="relative mx-auto h-[450px] w-full max-w-[590px] sm:h-[540px]" aria-label="Life milestones connected with the GrowVest investor experience">
      <div className="absolute inset-[9%_7%] rounded-[2.6rem] border border-white/10 bg-white/[0.035] shadow-[0_36px_100px_rgba(0,0,0,0.28)] backdrop-blur-sm" />
      <div className="absolute left-[11%] top-[19%] h-[56%] w-[56%] rounded-full border border-blue-400/15" />
      <div className="absolute left-[22%] top-[30%] h-[34%] w-[34%] rounded-full border border-yellow-300/10" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 590 540" aria-hidden="true">
        <path d="M100 145 C190 155 223 202 286 263" fill="none" stroke="rgba(245,179,1,0.34)" strokeWidth="1.2" strokeDasharray="5 8" />
        <path d="M402 95 C360 142 338 186 298 260" fill="none" stroke="rgba(31,78,216,0.55)" strokeWidth="1.2" strokeDasharray="5 8" />
        <path d="M105 398 C192 375 225 332 286 284" fill="none" stroke="rgba(31,78,216,0.48)" strokeWidth="1.2" strokeDasharray="5 8" />
        <path d="M452 390 C375 360 340 320 305 283" fill="none" stroke="rgba(245,179,1,0.30)" strokeWidth="1.2" strokeDasharray="5 8" />
      </svg>

      {chips.map(({ label, x, y, accent }) => (
        <div
          key={label}
          className="absolute rounded-2xl border border-white/10 bg-[#15151b]/90 px-4 py-3 shadow-2xl backdrop-blur-xl"
          style={{ left: x, top: y }}
        >
          <span className="mb-1 block h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 18px ${accent}` }} />
          <span className="text-[11px] font-semibold text-white/75">{label}</span>
        </div>
      ))}

      <div className="absolute left-[43%] top-[47%] z-10 w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/12 bg-[#0d0d12]/95 p-6 text-center shadow-[0_28px_80px_rgba(0,0,0,0.50)]">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${BLUE}24` }}>
          <Milestone size={19} style={{ color: GOLD }} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Life first</p>
        <p className="mt-2 text-[18px] font-bold leading-tight text-white" style={serif}>Your Wealth Journey</p>
      </div>

      <div className="absolute bottom-[1%] right-[2%] hidden w-[176px] rotate-[3deg] sm:block">
        <PhoneFrame screenKey="home" priority className="shadow-[0_28px_70px_rgba(0,0,0,0.46)]" />
      </div>
    </div>
  );
}

function PurposeBridge() {
  const portfolioItems = ["Investments", "Protection", "Reserves", "Other financial assets"];
  const purposeItems = ["Home", "Experiences", "Children", "Family", "Freedom", "Years Ahead"];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_170px_1.12fr] lg:items-center">
      <article className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_18px_55px_rgba(11,11,15,0.055)] sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">What you own</p>
        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${BLUE}0d` }}>
            <BriefcaseBusiness size={18} style={{ color: BLUE }} />
          </div>
          <h3 className="text-[23px] font-bold text-[#0B0B0F]" style={serif}>Your Portfolio</h3>
        </div>
        <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
          {portfolioItems.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-black/[0.055] bg-[#FAFBFD] px-4 py-3 text-[13px] font-semibold text-[#363B45]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLUE }} />
              {item}
            </div>
          ))}
        </div>
      </article>

      <div className="relative flex min-h-[104px] items-center justify-center lg:min-h-[260px]">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#D7DEED] to-transparent lg:hidden" />
        <div className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#D7DEED] to-transparent lg:block" />
        <div className="relative z-10 rounded-[1.65rem] border border-black/5 bg-[#0B0B0F] px-5 py-5 text-center shadow-[0_18px_48px_rgba(11,11,15,0.16)]">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${GOLD}18` }}>
            <Link2 size={16} style={{ color: GOLD }} />
          </div>
          <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">GrowVest</p>
          <p className="mt-1 text-[12px] font-semibold text-white">Connected with purpose</p>
        </div>
      </div>

      <article className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_18px_55px_rgba(11,11,15,0.055)] sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">What you're building towards</p>
        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${GOLD}14` }}>
            <Milestone size={18} style={{ color: GOLD }} />
          </div>
          <h3 className="text-[23px] font-bold text-[#0B0B0F]" style={serif}>Your Life</h3>
        </div>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {purposeItems.map((item, index) => (
            <span
              key={item}
              className="rounded-full border border-black/[0.055] px-4 py-2.5 text-[12px] font-semibold text-[#363B45]"
              style={{ background: index % 3 === 1 ? `${GOLD}0e` : `${BLUE}09` }}
            >
              {item}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}

function BucketListExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = MILESTONES[activeIndex];

  return (
    <div>
      <div className="hidden lg:grid lg:grid-cols-[1fr_0.82fr_1fr] lg:grid-rows-3 lg:items-center lg:gap-x-7 lg:gap-y-5">
        {MILESTONES.slice(0, 3).map((item, index) => (
          <MilestoneButton key={item.title} item={item} active={activeIndex === index} onActivate={() => setActiveIndex(index)} className={index === 0 ? "lg:col-start-1 lg:row-start-1" : index === 1 ? "lg:col-start-3 lg:row-start-1" : "lg:col-start-1 lg:row-start-3"} />
        ))}

        <div className="lg:col-start-2 lg:row-start-2 rounded-[2rem] bg-[#0B0B0F] p-7 text-center text-white shadow-[0_24px_70px_rgba(11,11,15,0.18)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${BLUE}25` }}>
            <ListChecks size={20} style={{ color: GOLD }} />
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Your life</p>
          <p className="mt-1 text-[24px] font-bold" style={serif}>Your Bucket List</p>
        </div>

        {MILESTONES.slice(3, 6).map((item, offset) => {
          const index = offset + 3;
          return <MilestoneButton key={item.title} item={item} active={activeIndex === index} onActivate={() => setActiveIndex(index)} className={offset === 0 ? "lg:col-start-3 lg:row-start-3" : offset === 1 ? "lg:col-start-1 lg:row-start-2" : "lg:col-start-3 lg:row-start-2"} />;
        })}

        <MilestoneButton item={MILESTONES[6]} active={activeIndex === 6} onActivate={() => setActiveIndex(6)} className="lg:col-start-2 lg:row-start-3" />
      </div>

      <div className="lg:hidden -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 sm:-mx-6 sm:px-6">
        {MILESTONES.map((item, index) => (
          <MilestoneButton key={item.title} item={item} active={activeIndex === index} onActivate={() => setActiveIndex(index)} className="min-w-[78%] snap-center sm:min-w-[48%]" />
        ))}
      </div>

      <div className="mx-auto mt-7 max-w-[760px] rounded-[1.7rem] border border-black/5 bg-[#F8F9FB] px-5 py-5 text-center sm:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: BLUE }}>{active.shortTitle}</p>
        <p className="mt-2 text-[14px] leading-7 text-[#555D6A]">{active.story}</p>
      </div>
    </div>
  );
}

function MilestoneButton({ item, active, onActivate, className = "" }) {
  const { Icon, title } = item;
  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      aria-pressed={active}
      className={`group rounded-[1.7rem] border p-5 text-left transition-all duration-300 ${active ? "-translate-y-1 border-[#1F4ED8]/30 bg-white shadow-[0_16px_46px_rgba(31,78,216,0.12)]" : "border-black/5 bg-white/90 shadow-[0_12px_34px_rgba(11,11,15,0.045)] hover:-translate-y-0.5 hover:border-black/10"} ${className}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-translate-y-0.5" style={{ background: active ? `${BLUE}13` : `${GOLD}0d` }}>
        <Icon size={17} strokeWidth={1.75} style={{ color: active ? BLUE : GOLD }} />
      </div>
      <p className="mt-5 text-[16px] font-bold text-[#0B0B0F]" style={serif}>{title}</p>
    </button>
  );
}

function ApproachTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    let frame = 0;

    const updateActiveStep = () => {
      frame = 0;
      const elements = stepRefs.current.filter(Boolean);
      if (!elements.length) return;

      const targetY = window.innerHeight * 0.46;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const focusY = rect.top + Math.min(rect.height * 0.42, 110);
        const distance = Math.abs(focusY - targetY);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveStep);
    };

    updateActiveStep();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const progress = APPROACH_STEPS.length > 1 ? activeIndex / (APPROACH_STEPS.length - 1) : 0;

  const scrollToStep = (index) => {
    setActiveIndex(index);
    stepRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div ref={timelineRef} className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">Life Architecture Model</p>
        <p className="mt-4 text-[27px] font-bold leading-tight text-[#0B0B0F] sm:text-[34px]" style={serif}>
          A structured process that stays connected with life.
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          {APPROACH_STEPS.map(({ Icon, title }, index) => {
            const current = activeIndex === index;
            const completed = index < activeIndex;
            return (
              <button
                key={title}
                type="button"
                onClick={() => scrollToStep(index)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-bold transition-all ${current ? "text-white shadow-[0_8px_24px_rgba(31,78,216,0.22)]" : completed ? "border border-[#1F4ED8]/15 bg-[#EEF3FF] text-[#1F4ED8]" : "border border-black/[0.065] bg-white text-[#6B7280]"}`}
                style={current ? { background: BLUE } : undefined}
                aria-current={current ? "step" : undefined}
              >
                <Icon size={13} strokeWidth={1.9} />
                {title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <div className="absolute bottom-[22px] left-[22px] top-[22px] w-px bg-[#DCE2EC]" />
        <div
          className="absolute left-[22px] top-[22px] w-px origin-top transition-[height] duration-500 ease-out"
          style={{ height: `calc((100% - 44px) * ${progress})`, background: BLUE }}
        />
        <div className="space-y-6">
          {APPROACH_STEPS.map(({ Icon, number, title, copy }, index) => {
            const current = activeIndex === index;
            const completed = index < activeIndex;
            return (
              <article
                key={title}
                ref={(element) => { stepRefs.current[index] = element; }}
                data-approach-index={index}
                className="relative pl-16"
              >
                <div
                  className="absolute left-0 top-6 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-[#F7F8FA] transition-all duration-500"
                  style={{
                    background: current ? BLUE : completed ? "#E7EEFF" : "#E7EBF2",
                    color: current ? "white" : completed ? BLUE : "#8A94A5",
                    boxShadow: current ? "0 10px 28px rgba(31,78,216,0.24)" : "none",
                  }}
                  aria-hidden="true"
                >
                  <Icon size={17} strokeWidth={1.9} />
                </div>
                <div className={`rounded-[1.8rem] border p-6 transition-all duration-500 sm:p-7 ${current ? "-translate-y-0.5 border-[#1F4ED8]/25 bg-white shadow-[0_18px_54px_rgba(31,78,216,0.11)]" : completed ? "border-[#1F4ED8]/10 bg-white" : "border-black/5 bg-white/70"}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${current || completed ? "text-[#1F4ED8]" : "text-[#8A94A5]"}`}>{number}</span>
                    {completed ? <Check size={13} style={{ color: BLUE }} aria-label="Completed stage" /> : null}
                  </div>
                  <h3 className="mt-2 flex items-center gap-2.5 text-[22px] font-bold text-[#0B0B0F]" style={serif}>
                    <Icon size={18} strokeWidth={1.8} style={{ color: current ? BLUE : completed ? BLUE : "#7D8796" }} />
                    {title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-[#6B7280]">{copy}</p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="ml-[22px] mt-1 h-12 w-px bg-gradient-to-b from-[#1F4ED8] to-transparent" aria-hidden="true" />
        <div className="ml-[6px] flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: `${BLUE}10`, color: BLUE }}><ArrowRight size={14} className="rotate-90" /></span>
          Track stays visible through the investor experience
        </div>
      </div>
    </div>
  );
}

function InvestorAppShowcase() {
  const [activeKey, setActiveKey] = useState("portfolio");
  const activeFeature = APP_FEATURES.find((item) => item.key === activeKey) || APP_FEATURES[0];
  const [primaryScreen, secondaryScreen] = activeFeature.screens;

  return (
    <div className="grid gap-9 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-12">
      <div className="order-2 lg:order-1">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {APP_FEATURES.map(({ key, Icon, title, copy }) => {
            const active = activeKey === key;
            return (
              <button
                key={key}
                type="button"
                onMouseEnter={() => setActiveKey(key)}
                onFocus={() => setActiveKey(key)}
                onClick={() => setActiveKey(key)}
                aria-pressed={active}
                className={`group rounded-[1.55rem] border p-5 text-left transition-all duration-300 ${active ? "border-white/22 bg-white/[0.095] shadow-[0_14px_44px_rgba(0,0,0,0.24)]" : "border-white/[0.07] bg-white/[0.035] hover:bg-white/[0.055]"}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-translate-y-0.5" style={{ background: active ? `${BLUE}35` : "rgba(255,255,255,0.06)" }}>
                    <Icon size={17} style={{ color: active ? "white" : "rgba(255,255,255,0.62)" }} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-white" style={serif}>{title}</h3>
                    <p className="mt-2 text-[12px] leading-6 text-white/50">{copy}</p>
                    <span className={`mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${active ? "text-[#F5B301]" : "text-white/30"}`}>
                      View screens <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-4 text-[11px] leading-5 text-white/45">
          <ShieldCheck size={15} className="mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
          <span>Actual GrowVest Investor App views. Available to existing GrowVest investors.</span>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="mx-auto max-w-[590px]" aria-label={`${activeFeature.title} screens from the GrowVest Investor App`}>
          <div className="relative h-[500px] sm:h-[610px]">
            <div className="absolute inset-[7%_2%_6%] rounded-[3rem] border border-white/[0.06] bg-[radial-gradient(circle_at_50%_30%,rgba(31,78,216,.16),transparent_42%),rgba(255,255,255,.025)]" />
            <div className="absolute left-[3%] top-[8%] z-30 h-[390px] aspect-[0.48] transition-all duration-500 sm:left-[9%] sm:h-[520px]">
              <div className="mb-3 flex items-center gap-2 px-2 text-[9px] font-bold uppercase tracking-[0.15em] text-white/45">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
                {activeFeature.title}
              </div>
              <PhoneFrame key={`${activeKey}-primary`} screenKey={primaryScreen} priority={primaryScreen === "home"} className="h-full w-full transition-all duration-500" />
            </div>
            <div className="absolute right-[1%] top-[15%] z-20 h-[390px] aspect-[0.48] rotate-[3deg] transition-all duration-500 sm:right-[5%] sm:top-[13%] sm:h-[520px]">
              <div className="mb-3 flex items-center justify-end gap-2 px-2 text-[9px] font-bold uppercase tracking-[0.15em] text-white/35">
                Connected view
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLUE }} />
              </div>
              <PhoneFrame key={`${activeKey}-secondary`} screenKey={secondaryScreen} emphasis className="h-full w-full transition-all duration-500" />
            </div>
          </div>

          <div className="relative z-40 mx-auto mt-4 max-w-[430px] rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-center backdrop-blur-md sm:px-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-white/40">One connected journey</p>
            <p className="mt-1.5 text-[11px] leading-5 text-white/58">Each part of the experience stays connected with the broader wealth journey.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function testimonialExcerpt(testimonial) {
  const raw = String(testimonial?.shortQuote || testimonial?.quote || "").trim().replace(/^[\s\"“”']+|[\s\"“”']+$/g, "");
  if (raw.length <= 260) return raw;
  return `${raw.slice(0, 257).trim()}...`;
}

function TrustProof({ testimonial }) {
  const quote = testimonialExcerpt(testimonial);
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-[1160px] px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionEyebrow>Trust and continuity</SectionEyebrow>
            <h2 className="max-w-[560px] text-[34px] font-bold leading-tight text-[#0B0B0F] sm:text-[42px] lg:text-[48px]" style={serif}>
              Built Around a Relationship, Not a Transaction.
            </h2>
            <p className="mt-6 max-w-[570px] text-[15px] leading-7 text-[#6B7280]">
              GrowVest brings together a structured process, investor-focused reviews and clear communication so important financial milestones stay connected to the broader journey.
            </p>

            {quote ? (
              <blockquote className="mt-8 rounded-[1.8rem] border border-black/5 bg-[#F8F9FB] p-6 sm:p-7">
                <Quote size={20} style={{ color: BLUE }} />
                <p className="mt-5 text-[16px] font-medium leading-8 text-[#2A303A]">“{quote}”</p>
                <div className="mt-5 flex items-center gap-3 border-t border-black/5 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF3FF] text-[11px] font-extrabold text-[#1F4ED8]">
                    {testimonial.initials || "GV"}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#0B0B0F]">{testimonial.displayName || "A GrowVest Investor"}</p>
                    <p className="mt-0.5 text-[11px] text-[#7A8190]">{testimonial.city || "Investor experience shared with consent"}</p>
                  </div>
                  <ShieldCheck size={14} className="ml-auto" style={{ color: BLUE }} aria-label="Consent verified" />
                </div>
                <p className="mt-4 text-[9px] leading-4 text-[#8A94A5]">Individual experiences may vary and should not be interpreted as a promise of financial outcomes or returns.</p>
              </blockquote>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-[13px] font-semibold">
              <Link href="/investor-experiences" className="text-[#1F4ED8] hover:underline">Investor Experiences</Link>
              <Link href="/disclosures" className="text-[#1F4ED8] hover:underline">Disclaimer & Disclosures</Link>
              <Link href="/privacy-policy" className="text-[#1F4ED8] hover:underline">Privacy Policy</Link>
              <Link href="/terms-of-use" className="text-[#1F4ED8] hover:underline">Terms of Use</Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: COMPANY.clientsSupported, label: "Investors Supported", Icon: Users },
              { value: COMPANY.reviewsCompleted, label: "Structured Reviews", Icon: Check },
              { value: COMPANY.coverage, label: "Coverage", Icon: MapPin },
            ].map(({ value, label, Icon }) => (
              <div key={label} className="rounded-3xl border border-black/5 bg-[#F8F9FB] p-6 shadow-[0_14px_40px_rgba(11,11,15,0.04)]">
                <div className="mb-7 flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: `${BLUE}0d` }}><Icon size={17} style={{ color: BLUE }} /></div>
                <p className="text-[25px] font-bold text-[#0B0B0F]" style={serif}>{value}</p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.13em] text-[#6B7280]">{label}</p>
              </div>
            ))}
            <div className="sm:col-span-3 rounded-3xl border border-black/5 bg-white p-6 shadow-[0_14px_40px_rgba(11,11,15,0.035)]">
              <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">GrowVest</p>
                  <p className="mt-2 text-[17px] font-bold text-[#0B0B0F]" style={serif}>{COMPANY.legalName}</p>
                  <p className="mt-2 text-[13px] text-[#6B7280]">{COMPANY.positioning}</p>
                </div>
                <div className="space-y-2 text-[12px] text-[#6B7280] sm:text-right">
                  <a href={`tel:${COMPANY.phoneHref}`} className="flex items-center gap-2 hover:text-[#1F4ED8] sm:justify-end"><span>{COMPANY.phoneDisplay}</span><MessageCircle size={13} /></a>
                  <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 hover:text-[#1F4ED8] sm:justify-end"><span>{COMPANY.email}</span><Mail size={13} /></a>
                </div>
              </div>
              <div className="mt-5 border-t border-black/5 pt-4 text-[10px] leading-5 text-[#7A8190]">
                {COMPANY.sebiStatus}. Please review the website disclosures for the scope of GrowVest services.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function InvestorExperience({ testimonial = null }) {
  const router = useRouter();
  const appSectionRef = useRef(null);
  const bucketListSectionRef = useRef(null);
  const formSectionRef = useRef(null);
  const formStartedRef = useRef(false);
  const scroll50Ref = useRef(false);
  const appViewedRef = useRef(false);
  const bucketViewedRef = useRef(false);
  const [formVisible, setFormVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [stickyEligible, setStickyEligible] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [campaign, setCampaign] = useState({ source: "", medium: "", campaign: "", term: "", content: "" });
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    clarity: "",
    consent: false,
    website: "",
  });

  const whatsappHref = useMemo(() => {
    const phone = String(COMPANY.phoneHref || "").replace(/\D/g, "");
    const text = encodeURIComponent("Hello GrowVest, I would like to start a conversation about my financial goals and milestones.");
    return `https://wa.me/${phone}?text=${text}`;
  }, []);

  useEffect(() => {
    setCampaign(readCampaignAttribution());
    trackEvent("landing_page_view", { campaign_page: "investor_experience" });
  }, []);

  useEffect(() => {
    function handleScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const ratio = window.scrollY / maxScroll;
      setStickyEligible(ratio >= 0.2);
      if (!scroll50Ref.current && ratio >= 0.5) {
        scroll50Ref.current = true;
        trackEvent("landing_page_50_scroll", { campaign_page: "investor_experience" });
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const appElement = appSectionRef.current;
    const bucketElement = bucketListSectionRef.current;
    const formElement = formSectionRef.current;
    if (!appElement && !bucketElement && !formElement) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === appElement && entry.isIntersecting && entry.intersectionRatio >= 0.3 && !appViewedRef.current) {
          appViewedRef.current = true;
          trackEvent("investor_app_section_viewed", { campaign_page: "investor_experience" });
        }
        if (entry.target === bucketElement && entry.isIntersecting && entry.intersectionRatio >= 0.3 && !bucketViewedRef.current) {
          bucketViewedRef.current = true;
          trackEvent("bucket_list_section_view", { campaign_page: "investor_experience" });
        }
        if (entry.target === formElement) setFormVisible(entry.isIntersecting);
      });
    }, { threshold: [0, 0.3, 0.55] });

    if (appElement) observer.observe(appElement);
    if (bucketElement) observer.observe(bucketElement);
    if (formElement) observer.observe(formElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setFooterVisible(entry.isIntersecting));
    }, { threshold: 0.05 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  function scrollToSection(id, analyticsEvent, location) {
    if (analyticsEvent) trackEvent(analyticsEvent, { campaign_page: "investor_experience", location });
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function markFormStarted() {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    trackEvent("lead_form_started", { campaign_page: "investor_experience" });
  }

  function selectClarity(option) {
    markFormStarted();
    setError("");
    setForm((current) => ({ ...current, clarity: option }));
  }

  function handleChange(event) {
    markFormStarted();
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!form.clarity) {
      setStatus("error");
      setError("Please choose what you would like greater clarity around.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/investor-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sourcePage: window.location.pathname,
          campaign,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "We could not submit your request.");

      trackEvent("lead_form_submitted", {
        campaign_page: "investor_experience",
        clarity_area: form.clarity,
        request_reference: data.requestId || undefined,
      });
      setStatus("success");
      router.push("/thank-you");
    } catch (submissionError) {
      setStatus("error");
      trackEvent("lead_form_error", { campaign_page: "investor_experience", clarity_area: form.clarity || "not_selected" });
      setError(submissionError.message || `Please email ${COMPANY.email} or call ${COMPANY.phoneDisplay}.`);
    }
  }

  const showSticky = stickyEligible && !formVisible && !footerVisible;

  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "112px" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 58% 58% at 24% 50%, rgba(31,78,216,0.18) 0%, transparent 66%), radial-gradient(ellipse 38% 38% at 78% 28%, rgba(245,179,1,0.09) 0%, transparent 66%)` }} />
        <div className="relative mx-auto grid min-h-[calc(88vh-112px)] w-full max-w-[1320px] items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1.03fr_0.97fr] lg:px-8 lg:py-24">
          <div className="max-w-[690px]">
            <div className="gv-hero-intro gv-hero-intro--1"><SectionEyebrow dark>The GrowVest Investor Experience</SectionEyebrow></div>
            <h1 className="gv-hero-intro gv-hero-intro--2 text-[46px] font-bold leading-[1.02] text-white sm:text-[58px] xl:text-[72px]" style={serif}>
              What Are You Building<br className="hidden sm:block" /> Your Wealth For?
            </h1>
            <div className="gv-hero-intro gv-hero-intro--3 mt-7 max-w-[585px] space-y-2 text-[16px] leading-7 text-white/65 sm:text-[17px]">
              <p>Your investments are part of the picture.</p>
              <p>The life you are building is the reason behind it.</p>
              <p>GrowVest brings your wealth, milestones and Bucket List into a more connected journey.</p>
            </div>
            <div className="gv-hero-intro gv-hero-intro--4 mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                data-analytics-event="start_conversation_click"
                data-analytics-location="hero"
                onClick={() => scrollToSection("start-a-conversation", null, "hero")}
                className="gv-btn-primary inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-95"
                style={{ background: BLUE, boxShadow: `0 10px 36px ${BLUE}50` }}
              >
                Start a Conversation <ArrowRight size={17} />
              </button>
              <button
                type="button"
                data-analytics-event="discover_approach_click"
                data-analytics-location="hero"
                onClick={() => scrollToSection("growvest-approach", null, "hero")}
                className="gv-btn-secondary inline-flex items-center justify-center gap-2 rounded-full border border-white/16 px-7 py-4 text-[15px] font-semibold text-white/80 transition-all hover:border-white/30 hover:bg-white/[0.05]"
              >
                Discover the GrowVest Approach
              </button>
            </div>
          </div>
          <div className="gv-hero-intro gv-hero-intro--5">
            <HeroJourneyVisual />
          </div>
        </div>
      </section>

      <section className="bg-[#F7F8FA] py-20 lg:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-[800px] text-center">
            <SectionEyebrow center>Portfolio vs Purpose</SectionEyebrow>
            <h2 className="text-[36px] font-bold leading-tight text-[#0B0B0F] sm:text-[48px] lg:text-[54px]" style={serif}>A Portfolio Can Tell You What You Own.</h2>
            <p className="mt-5 text-[19px] font-bold leading-8 text-[#737B89] sm:text-[22px]" style={serif}>But does it tell you what you're building towards?</p>
          </div>
          <PurposeBridge />
          <p className="mx-auto mt-9 max-w-[760px] text-center text-[15px] leading-7 text-[#606977]">
            Investments become more meaningful when they are connected with the life they are meant to support.
          </p>
        </div>
      </section>

      <section ref={bucketListSectionRef} className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_82%,rgba(31,78,216,.06),transparent_26%),radial-gradient(circle_at_90%_16%,rgba(245,179,1,.07),transparent_25%)]" />
        <div className="relative mx-auto max-w-[1160px] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-[760px] text-center">
            <SectionEyebrow center>Bucket List</SectionEyebrow>
            <h2 className="text-[36px] font-bold leading-tight text-[#0B0B0F] sm:text-[48px] lg:text-[54px]" style={serif}>Your Bucket List Gives Wealth a Direction.</h2>
            <p className="mx-auto mt-5 max-w-[600px] text-[15px] leading-7 text-[#6B7280]">The goal is rarely just a number. There is usually a life behind it.</p>
          </div>
          <BucketListExperience />
          <p className="mx-auto mt-9 max-w-[760px] text-center text-[14px] leading-7 text-[#6B7280]">At GrowVest, your Bucket List helps connect your wealth with the milestones that matter to you.</p>
        </div>
      </section>

      <section id="growvest-approach" className="scroll-mt-24 bg-[#F7F8FA] py-20 lg:py-28">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-[760px]">
            <SectionEyebrow>The GrowVest Approach</SectionEyebrow>
            <h2 className="text-[36px] font-bold leading-tight text-[#0B0B0F] sm:text-[48px] lg:text-[54px]" style={serif}>From What Matters to What Comes Next.</h2>
            <p className="mt-5 max-w-[680px] text-[15px] leading-7 text-[#6B7280]">GrowVest follows a structured process that starts with your life and stays connected with your progress.</p>
          </div>
          <ApproachTimeline />
        </div>
      </section>

      <section ref={appSectionRef} className="relative overflow-hidden py-20 lg:py-28" style={{ background: BLACK, ...dotGrid }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 50% 54% at 76% 48%, rgba(31,78,216,0.18) 0%, transparent 68%), radial-gradient(ellipse 32% 34% at 16% 24%, rgba(245,179,1,0.06) 0%, transparent 70%)` }} />
        <div className="relative mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-[780px] text-center">
            <SectionEyebrow dark center>The GrowVest Investor App</SectionEyebrow>
            <h2 className="text-[37px] font-bold leading-tight text-white sm:text-[50px] lg:text-[56px]" style={serif}>Your Wealth Journey. Now Closer to You.</h2>
            <p className="mx-auto mt-6 max-w-[650px] text-[15px] leading-7 text-white/58">We have created a simpler way for GrowVest investors to stay connected with the important parts of their wealth journey.</p>
          </div>
          <InvestorAppShowcase />
        </div>
      </section>

      <section className="py-20 lg:py-28" style={{ background: GRAY }}>
        <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-[720px] text-center">
            <SectionEyebrow center>Why GrowVest</SectionEyebrow>
            <h2 className="text-[36px] font-bold leading-tight text-[#0B0B0F] sm:text-[46px] lg:text-[52px]" style={serif}>Wealth Deserves More Than Information.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {PILLARS.map(({ Icon, title, copy }, index) => (
              <article key={title} className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-[0_15px_50px_rgba(11,11,15,0.04)] transition-transform duration-300 hover:-translate-y-1">
                <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: index === 1 ? `${GOLD}14` : `${BLUE}0d` }}>
                  <Icon size={19} strokeWidth={1.75} style={{ color: index === 1 ? GOLD : BLUE }} />
                </div>
                <h3 className="text-[19px] font-bold text-[#0B0B0F]" style={serif}>{title}</h3>
                <p className="mt-3 text-[13px] leading-6 text-[#6B7280]">{copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">GrowVest</p>
            <p className="mt-2 text-[22px] font-bold text-[#0B0B0F]" style={serif}>{COMPANY.positioning}</p>
          </div>
        </div>
      </section>

      <TrustProof testimonial={testimonial} />

      <section id="start-a-conversation" ref={formSectionRef} className="relative scroll-mt-24 overflow-hidden py-20 lg:py-28" style={{ background: BLACK, ...dotGrid }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 50% 60% at 16% 60%, rgba(31,78,216,0.16) 0%, transparent 70%), radial-gradient(ellipse 40% 45% at 90% 20%, rgba(245,179,1,0.08) 0%, transparent 65%)` }} />
        <div className="relative mx-auto grid max-w-[1160px] gap-12 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:px-8">
          <div className="lg:sticky lg:top-28">
            <SectionEyebrow dark>Start a Conversation</SectionEyebrow>
            <h2 className="text-[38px] font-bold leading-tight text-white sm:text-[48px]" style={serif}>What Are You Building Towards?</h2>
            <p className="mt-6 max-w-[470px] text-[15px] leading-7 text-white/58">If you would like greater clarity around your financial milestones and the life you are building towards, start a conversation with GrowVest.</p>
            <div className="mt-8 space-y-4 text-[13px] text-white/55">
              <a href={`tel:${COMPANY.phoneHref}`} className="flex items-center gap-3 hover:text-white"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06]"><MessageCircle size={15} style={{ color: BLUE }} /></span>{COMPANY.phoneDisplay}</a>
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 hover:text-white"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06]"><Mail size={15} style={{ color: BLUE }} /></span>{COMPANY.email}</a>
            </div>
          </div>

          <form onSubmit={handleSubmit} onFocusCapture={markFormStarted} className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.30)] backdrop-blur-xl sm:p-8">
            <div>
              <p className="text-[18px] font-bold text-white" style={serif}>Tell us where you would like greater clarity.</p>
              <p className="mt-2 text-[12px] leading-6 text-white/50">It takes less than a minute. No sensitive financial information is required here.</p>
            </div>

            <fieldset className="mt-6">
              <legend className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">What would you like greater clarity around? *</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {CLARITY_OPTIONS.map((option) => {
                  const selected = form.clarity === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectClarity(option)}
                      aria-pressed={selected}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left text-[12px] font-semibold leading-5 transition-all ${selected ? "border-blue-400/50 bg-blue-500/12 text-white" : "border-white/10 bg-white/[0.045] text-white/66 hover:border-white/20 hover:bg-white/[0.065]"}`}
                    >
                      <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border ${selected ? "border-blue-300 bg-blue-500 text-white" : "border-white/15 text-transparent"}`}>
                        <Check size={13} />
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-7 border-t border-white/10 pt-7">
              <p className="text-[15px] font-bold text-white" style={serif}>Your details</p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="investor-experience-name" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">Full Name *</label>
                  <input id="investor-experience-name" required name="name" value={form.name} onChange={handleChange} autoComplete="name" className="w-full rounded-xl border border-white/10 bg-white/[0.065] px-4 py-3.5 text-[14px] text-white outline-none placeholder:text-white/35 focus:border-blue-400" placeholder="Your full name" />
                </div>
                <div>
                  <label htmlFor="investor-experience-phone" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">Mobile Number *</label>
                  <input id="investor-experience-phone" required name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" inputMode="tel" className="w-full rounded-xl border border-white/10 bg-white/[0.065] px-4 py-3.5 text-[14px] text-white outline-none placeholder:text-white/35 focus:border-blue-400" placeholder="+91 98765 43210" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="investor-experience-email" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">Email Address *</label>
                  <input id="investor-experience-email" required name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" className="w-full rounded-xl border border-white/10 bg-white/[0.065] px-4 py-3.5 text-[14px] text-white outline-none placeholder:text-white/35 focus:border-blue-400" placeholder="you@example.com" />
                </div>
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="investor-experience-website">Website</label>
                  <input id="investor-experience-website" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                </div>
                <label className="sm:col-span-2 flex cursor-pointer items-start gap-3 text-[12px] leading-6 text-white/58">
                  <input required type="checkbox" name="consent" checked={form.consent} onChange={handleChange} className="mt-1 h-4 w-4 flex-shrink-0 accent-blue-600" />
                  <span>I agree that GrowVest may use these details to respond to my request and contact me about this enquiry.</span>
                </label>
              </div>
            </div>

            {error ? <p role="alert" className="mt-5 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-[12px] leading-6 text-red-100">{error}</p> : null}

            <div className="mt-6">
              <button type="submit" disabled={status === "submitting"} className="gv-btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto" style={{ background: BLUE, boxShadow: `0 9px 34px ${BLUE}40` }}>
                {status === "submitting" ? "Submitting..." : "Start a Conversation"} {status !== "submitting" ? <ArrowRight size={16} /> : null}
              </button>
              <p className="mt-4 text-[11px] leading-5 text-white/42">Prefer WhatsApp? <a href={whatsappHref} target="_blank" rel="noreferrer" data-analytics-event="whatsapp_click" data-analytics-location="lead_form" className="font-semibold text-white/70 underline decoration-white/20 underline-offset-4 hover:text-white">Talk to GrowVest on WhatsApp</a></p>
            </div>
          </form>
        </div>
      </section>

      {showSticky ? (
        <div className="gv-campaign-sticky-cta" aria-label="Investor Experience campaign actions">
          <button
            type="button"
            data-analytics-event="start_conversation_click"
            data-analytics-location="mobile_sticky"
            onClick={() => scrollToSection("start-a-conversation", null, "mobile_sticky")}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-[13px] font-semibold text-white"
            style={{ background: BLUE }}
          >
            Start a Conversation <ArrowRight size={15} />
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Talk to GrowVest on WhatsApp"
            data-analytics-event="whatsapp_click"
            data-analytics-location="mobile_sticky"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white text-[#0B0B0F]"
          >
            <MessageCircle size={17} />
          </a>
        </div>
      ) : null}
    </>
  );
}
