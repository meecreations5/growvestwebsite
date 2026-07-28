"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { COMPANY } from "../lib/brand";
import { GrowVestMark } from "./GrowVestMark";

export function InvestorPortalTransition() {
  const [visible, setVisible] = useState(false);
  const [destination, setDestination] = useState(COMPANY.investorPortalUrl);
  const timerRef = useRef(null);

  useEffect(() => {
    function handlePortalClick(event) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a[data-investor-portal="true"]');
      if (!link || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const href = link.href || COMPANY.investorPortalUrl;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      event.preventDefault();
      setDestination(href);

      if (reducedMotion) {
        window.location.assign(href);
        return;
      }

      setVisible(true);
      timerRef.current = window.setTimeout(() => window.location.assign(href), 720);
    }

    document.addEventListener("click", handlePortalClick, true);
    return () => {
      document.removeEventListener("click", handlePortalClick, true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="gv-portal-transition" role="status" aria-live="polite" aria-label="Opening the secure GrowVest Investor Portal">
      <div className="gv-portal-transition__card">
        <div className="gv-portal-transition__mark">
          <GrowVestMark animated ambient decorative className="h-auto w-full" />
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F5B301]">
            <ShieldCheck size={14} aria-hidden="true" /> Secure client access
          </div>
          <p className="text-[18px] font-semibold text-white">Taking you to your GrowVest Investor Portal.</p>
          <p className="mt-2 text-[12px] leading-relaxed text-white/65">Your reports, goals, documents and updates are available in the secure portal.</p>
          <a href={destination} className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#8FA8FF]">
            Continue now <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
