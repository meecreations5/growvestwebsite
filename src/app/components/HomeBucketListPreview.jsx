"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  GraduationCap,
  HeartPulse,
  Home,
  Plane,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { trackEvent } from "../lib/analytics";

const GOALS = [
  { id: "child-education", label: "Child Education", Icon: GraduationCap, tone: "gold" },
  { id: "dream-home", label: "Dream Home", Icon: Home, tone: "blue" },
  { id: "retirement", label: "Retirement Freedom", Icon: Star, tone: "green" },
  { id: "emergency-reserve", label: "Family Security", Icon: Shield, tone: "red" },
  { id: "travel-sabbatical", label: "Travel & Experiences", Icon: Plane, tone: "pink" },
  { id: "wealth-legacy", label: "Wealth & Legacy", Icon: TrendingUp, tone: "gold" },
  { id: "health-corpus", label: "Health Preparedness", Icon: HeartPulse, tone: "orange" },
  { id: "nri-global-goal", label: "Global Aspirations", Icon: Sparkles, tone: "blue" },
];

const toneClasses = {
  blue: "text-[#1F4ED8] bg-[#1F4ED8]/10",
  gold: "text-[#A87500] bg-[#F5B301]/15",
  green: "text-emerald-700 bg-emerald-500/10",
  red: "text-[#E53935] bg-[#E53935]/10",
  pink: "text-pink-700 bg-pink-500/10",
  orange: "text-orange-700 bg-orange-500/10",
};

export function HomeBucketListPreview() {
  const [selected, setSelected] = useState([]);
  const selectedGoals = useMemo(() => GOALS.filter((goal) => selected.includes(goal.id)), [selected]);
  const builderHref = selected.length
    ? `/bucket-list-builder?goals=${encodeURIComponent(selected.join(","))}`
    : "/bucket-list-builder";

  function toggleGoal(goal) {
    setSelected((current) => {
      const exists = current.includes(goal.id);
      if (exists) {
        trackEvent("bucket_preview_goal_removed", { goal_id: goal.id });
        return current.filter((id) => id !== goal.id);
      }

      if (current.length >= 3) return current;
      trackEvent("bucket_preview_goal_selected", { goal_id: goal.id, selection_number: current.length + 1 });
      return [...current, goal.id];
    });
  }

  return (
    <section className="relative overflow-hidden bg-[#0B0B0F] py-24 lg:py-32" id="bucket-list-preview">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_65%_at_80%_40%,rgba(31,78,216,0.18),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-[720px]">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#F5B301]">Your Bucket List</p>
          <h2 className="font-serif text-[38px] font-bold leading-tight text-white sm:text-[46px] lg:text-[54px]">
            Choose what matters. See how your journey begins.
          </h2>
          <p className="mt-5 max-w-[620px] text-[15px] leading-relaxed text-white/70">
            Select up to three aspirations. This is not a financial recommendation—it is a simple way to begin shaping a roadmap around your life.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1fr_390px] lg:items-start">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {GOALS.map(({ id, label, Icon, tone }) => {
              const active = selected.includes(id);
              const disabled = !active && selected.length >= 3;

              return (
                <button
                  type="button"
                  key={id}
                  aria-pressed={active}
                  disabled={disabled}
                  onClick={() => toggleGoal({ id, label })}
                  className={`group min-h-[142px] rounded-3xl border p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4ED8] disabled:cursor-not-allowed disabled:opacity-40 ${
                    active
                      ? "-translate-y-1 border-[#F5B301]/70 bg-white text-[#0B0B0F] shadow-[0_18px_45px_rgba(0,0,0,0.26)]"
                      : "border-white/10 bg-white/[0.055] text-white hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08]"
                  }`}
                >
                  <span className="mb-5 flex items-start justify-between gap-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClasses[tone]}`}>
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${active ? "border-[#1F4ED8] bg-[#1F4ED8] text-white" : "border-white/20 text-transparent"}`}>
                      <Check size={13} aria-hidden="true" />
                    </span>
                  </span>
                  <span className="block font-serif text-[16px] font-bold leading-snug">{label}</span>
                  <span className={`mt-2 block text-[11px] ${active ? "text-[#6B7280]" : "text-white/55"}`}>
                    {active ? "Added to your starting map" : "Select this aspiration"}
                  </span>
                </button>
              );
            })}
          </div>

          <aside className="rounded-[30px] border border-white/10 bg-white/[0.065] p-7 backdrop-blur-xl lg:sticky lg:top-24">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F5B301]">Your Starting Map</p>
                <p className="mt-1 text-[13px] text-white/60">{selected.length}/3 aspirations selected</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1F4ED8]/20 text-[#8FA8FF]">
                <Sparkles size={20} aria-hidden="true" />
              </div>
            </div>

            {selectedGoals.length ? (
              <div className="space-y-3" aria-live="polite">
                {selectedGoals.map(({ id, label }, index) => (
                  <div key={id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5B301]/15 text-[11px] font-bold text-[#F5B301]">{index + 1}</span>
                    <span className="text-[13px] font-medium text-white">{label}</span>
                  </div>
                ))}
                <p className="pt-3 font-serif text-[22px] font-bold leading-snug text-white">
                  Your life deserves a plan built around these aspirations.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 px-5 py-8 text-center">
                <p className="font-serif text-[19px] font-bold text-white">Begin with what matters most.</p>
                <p className="mt-2 text-[12px] leading-relaxed text-white/55">Your selections will appear here and continue into the Bucket List Builder.</p>
              </div>
            )}

            <Link
              href={builderHref}
              onClick={() => trackEvent("bucket_preview_continue", { selected_goal_count: selected.length })}
              className="gv-btn-primary mt-7 flex w-full items-center justify-center gap-2"
            >
              Build My Bucket List <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <p className="mt-3 text-center text-[10.5px] leading-relaxed text-white/50">Educational planning preview. You can change every selection in the full builder.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
