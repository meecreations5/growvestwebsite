"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function SiteMotionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    /*
     * Important hydration rule:
     * This root-level component must not inject classes into streamed route
     * markup. App Router can place a new segment in the DOM before that segment
     * finishes hydrating, so className mutations here can create mismatches.
     * Section and button effects are therefore handled with stable CSS only.
     */

    const parallaxElements = Array.from(document.querySelectorAll("[data-parallax-speed]"));
    let frame = null;

    const updateParallax = () => {
      frame = null;
      const viewportCenter = window.innerHeight / 2;

      parallaxElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

        const speed = Number(element.dataset.parallaxSpeed || 0);
        const elementCenter = rect.top + rect.height / 2;
        const distance = elementCenter - viewportCenter;
        const shift = Math.max(-64, Math.min(64, distance * speed));
        element.style.setProperty("--gv-parallax-y", `${shift.toFixed(2)}px`);
      });
    };

    const requestUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updateParallax);
    };

    // No eager DOM writes. Values update only after a real user scroll or resize.
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      parallaxElements.forEach((element) => {
        element.style.removeProperty("--gv-parallax-y");
      });
    };
  }, [pathname]);

  return null;
}
