"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { usePathname } from "next/navigation";
import { COMPANY } from "../lib/brand";

export function MobileActionBar({ investorPortalUrl = COMPANY.investorPortalUrl, primaryCta = { label: "Begin Your Journey", href: "/contact" } }) {
  const pathname = usePathname() || "/";
  const [visible, setVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/contact") {
      setVisible(false);
      return undefined;
    }

    let frame = null;
    const update = () => {
      frame = null;
      setVisible(window.scrollY > Math.min(560, window.innerHeight * 0.72));
    };
    const handleScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const footer = document.querySelector("[data-site-footer]");
    if (!footer) return undefined;

    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0.02 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);


  useEffect(() => {
    const handleGuideState = (event) => setGuideOpen(Boolean(event.detail?.open));
    setGuideOpen(document.body.dataset.growvestGuideOpen === "true");
    window.addEventListener("growvest-guide-state", handleGuideState);
    return () => window.removeEventListener("growvest-guide-state", handleGuideState);
  }, []);

  const show = visible && !footerVisible && !guideOpen && pathname !== "/contact";

  return (
    <div className={`gv-mobile-action-bar xl:hidden ${show ? "gv-mobile-action-bar--visible" : ""}`} aria-hidden={!show}>
      <a
        href={investorPortalUrl}
        data-investor-portal="true"
        data-analytics-event="investor_portal_click"
        data-analytics-location="mobile_sticky_bar"
        tabIndex={show ? 0 : -1}
        className="gv-mobile-action-bar__portal" aria-label="Open Investor Portal"
      >
        <LockKeyhole size={14} aria-hidden="true" />
        Portal
        <ArrowUpRight size={12} aria-hidden="true" />
      </a>
      <Link
        href={primaryCta.href || "/contact"}
        data-analytics-event="primary_cta_click"
        data-analytics-location="mobile_sticky_bar"
        tabIndex={show ? 0 : -1}
        className="gv-btn-primary gv-mobile-action-bar__primary"
      >
        {primaryCta.label || "Begin Your Journey"}
      </Link>
    </div>
  );
}
