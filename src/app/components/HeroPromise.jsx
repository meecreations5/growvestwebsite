"use client";

import { useEffect, useState } from "react";

const promises = [
  "protecting what matters today.",
  "planning for the life you imagine.",
  "growing with clarity and discipline.",
  "experiencing wealth more meaningfully.",
];

export function HeroPromise() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % promises.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mb-8 flex min-h-7 flex-wrap items-center gap-x-3 gap-y-1 text-[13px] sm:text-[14px]">
      <span className="h-px w-7 flex-shrink-0 bg-[#F5B301]/50" />
      <span className="text-white/65">Conscious wealth means</span>
      <span className="sr-only">{promises.join(" ")}</span>
      <span key={promises[active]} aria-hidden="true" className="gv-rotating-copy font-semibold text-[#F5B301]">
        {promises[active]}
      </span>
    </div>
  );
}
