"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, LockKeyhole, Menu, X } from "lucide-react";
import { NAV_GROUPS, COMPANY } from "../lib/brand";
import { GrowVestMark } from "./GrowVestMark";
import { GrowVestLogo } from "./GrowVestLogo";
import { SocialLinks } from "./SocialLinks";

function DesktopDropdown({ group, pathname, open, onOpen, onClose, onToggle, align = "center" }) {
  const buttonRef = useRef(null);
  const closeTimerRef = useRef(null);
  const menuId = `desktop-menu-${group.label.toLowerCase().replaceAll(" ", "-")}`;
  const isGroupActive = group.children.some((item) => pathname === item.path);

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function handleOpen() {
    clearCloseTimer();
    onOpen();
  }

  function handleClose() {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(onClose, 260);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      onClose();
      buttonRef.current?.focus();
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      onOpen();
    }
  }

  useEffect(() => () => clearCloseTimer(), []);

  const alignmentClass =
    align === "right" ? "right-0" : align === "left" ? "left-0" : "left-1/2 -translate-x-1/2";

  return (
    <div
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={onToggle}
        className={`group flex items-center gap-1 rounded-full px-1.5 py-2 text-[12px] font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F4ED8] ${
          isGroupActive || open ? "text-amber-400" : "text-white/70 hover:text-white"
        }`}
      >
        {group.label}
        <ChevronDown
          size={12}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : "group-hover:translate-y-0.5"}`}
        />
      </button>

      <div
        className={`absolute top-full z-50 pt-2 ${alignmentClass} ${
          open ? "pointer-events-auto visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-1 opacity-0"
        } transition-[opacity,visibility,transform] duration-150`}
      >
        <div
          id={menuId}
          className="w-[292px] overflow-hidden rounded-[18px] border border-white/10 bg-[#101018]/98 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.58)] backdrop-blur-2xl"
        >
          <p className="px-3 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.19em] text-[#F5B301]">
            {group.eyebrow}
          </p>

          <div className="grid gap-1">
            {group.children.map(({ label, path }) => {
              const active = pathname === path;

              return (
                <Link
                  key={label}
                  href={path}
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                  className={`group/item flex items-center justify-between gap-4 rounded-xl border px-3 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4ED8]/80 ${
                    active
                      ? "border-amber-400/30 bg-amber-400/[0.08] text-amber-300"
                      : "border-transparent text-white/85 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span className="text-[13px] font-medium">{label}</span>
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className={`shrink-0 transition-transform group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 ${
                      active ? "text-amber-300" : "text-white/30 group-hover/item:text-[#F5B301]"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader({ socialLinks = [], navigation = null, settings = null }) {
  const sourceGroups = navigation?.groups?.length ? navigation.groups : NAV_GROUPS;
  const navGroups = [...sourceGroups]
    .map((group) => ({
      ...group,
      children: (group.children || [])
        .map((item) => ({ ...item, path: item.path || item.href || "" }))
        .filter((item) => item.label && item.path),
    }))
    .filter((group) => group.label && group.children.length)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  const homeLabel = navigation?.homeLabel || "Home";
  const investorPortalLabel = navigation?.investorPortalLabel || "Investor Portal";
  const investorPortalUrl = settings?.investorPortalUrl || COMPANY.investorPortalUrl;
  const headerCta = navigation?.headerPrimaryCta || { label: "Begin Your Journey", href: "/contact" };
  const [desktopGroup, setDesktopGroup] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const pathname = usePathname() || "/";

  useEffect(() => {
    setDesktopGroup(null);
    setMobileOpen(false);
    setMobileGroup(null);
  }, [pathname]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) setDesktopGroup(null);
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setDesktopGroup(null);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("gv-mobile-menu-open", mobileOpen);
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.classList.remove("gv-mobile-menu-open");
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px), (min-width: 1280px)");
    const closeTabletMenu = (event) => {
      if (event.matches) {
        setMobileOpen(false);
        setMobileGroup(null);
      }
    };

    closeTabletMenu(media);
    media.addEventListener?.("change", closeTabletMenu);
    return () => media.removeEventListener?.("change", closeTabletMenu);
  }, []);

  useEffect(() => {
    let frame = null;
    const update = () => {
      frame = null;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-white/10 bg-[#0B0B0F]/98 shadow-[0_12px_35px_rgba(0,0,0,0.25)]"
          : "border-white/10 bg-[#0B0B0F]/92"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1500px] items-center justify-between px-4 transition-[height] duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "h-[60px] sm:h-[64px]" : "h-[64px] sm:h-[72px]"
        }`}
      >
        <Link
          href="/"
          aria-label="GrowVest home"
          className={`gv-header-logo group flex min-w-0 items-center ${scrolled ? "gv-header-logo--compact" : ""}`}
        >
          <span className="gv-header-wordmark" aria-hidden={scrolled ? "true" : undefined}>
            <GrowVestLogo className="gv-logo-enter" />
          </span>
          <span className="gv-header-icon" aria-hidden={!scrolled ? "true" : undefined}>
            <GrowVestMark ambient decorative className="h-auto w-full" />
          </span>
          <span className="sr-only">{settings?.positioning || COMPANY.positioning}</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-2.5 xl:flex">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`py-2 text-[12px] font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F4ED8] ${
              pathname === "/" ? "text-amber-400" : "text-white/70 hover:text-white"
            }`}
          >
            {homeLabel}
          </Link>

          {navGroups.map((group, index) => (
            <DesktopDropdown
              key={group.label}
              group={group}
              pathname={pathname}
              open={desktopGroup === group.label}
              onOpen={() => setDesktopGroup(group.label)}
              onClose={() => setDesktopGroup((current) => (current === group.label ? null : current))}
              onToggle={() => setDesktopGroup((current) => (current === group.label ? null : group.label))}
              align={index === navGroups.length - 1 ? "right" : index === 0 ? "left" : "center"}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 xl:flex">
          <a
            href={investorPortalUrl}
            data-investor-portal="true"
            data-analytics-event="investor_portal_click"
            data-analytics-location="desktop_header"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2.5 text-[12px] font-semibold text-white/80 transition-all hover:border-[#1F4ED8]/60 hover:bg-[#1F4ED8]/[0.10] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F4ED8]"
          >
            <LockKeyhole size={13} aria-hidden="true" className="text-[#F5B301]" />
            {investorPortalLabel}
            <ArrowUpRight size={12} aria-hidden="true" className="text-white/35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          <Link
            href={headerCta.href || "/contact"}
            data-analytics-event="primary_cta_click"
            data-analytics-location="desktop_header"
            className="gv-btn-primary gv-btn-primary--compact"
          >
            {headerCta.label || "Begin Your Journey"}
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <a
            href={investorPortalUrl}
            aria-label={investorPortalLabel}
            data-investor-portal="true"
            data-analytics-event="investor_portal_click"
            data-analytics-location="mobile_header"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/10 text-white transition hover:border-[#1F4ED8]/60 hover:bg-[#1F4ED8]/10 focus-visible:outline-2 focus-visible:outline-[#1F4ED8] md:hidden"
          >
            <LockKeyhole size={18} aria-hidden="true" className="text-[#F5B301]" />
          </a>

          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="hidden min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/10 p-2 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#1F4ED8] md:inline-flex xl:hidden"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="gv-mobile-navigation hidden overflow-y-auto overscroll-contain border-t border-white/10 bg-[#0B0B0F] md:block xl:hidden"
          style={{ maxHeight: `calc(100dvh - ${scrolled ? 60 : 64}px)` }}
        >
          <div className="px-4 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-3 sm:px-6">
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
              className={`block border-b border-white/10 py-3.5 text-[14px] ${
                pathname === "/" ? "font-semibold text-amber-300" : "text-white/75 hover:text-white"
              }`}
            >
              {homeLabel}
            </Link>

            {navGroups.map((group) => {
              const groupOpen = mobileGroup === group.label;
              const groupActive = group.children.some((item) => pathname === item.path);
              const groupId = `mobile-${group.label.toLowerCase().replaceAll(" ", "-")}`;

              return (
                <div key={group.label}>
                  <button
                    type="button"
                    aria-expanded={groupOpen}
                    aria-controls={groupId}
                    className={`flex w-full items-center justify-between border-b border-white/10 py-3.5 text-left text-[14px] transition-colors ${
                      groupActive || groupOpen ? "font-semibold text-amber-300" : "text-white/75 hover:text-white"
                    }`}
                    onClick={() => setMobileGroup(groupOpen ? null : group.label)}
                  >
                    <span>{group.label}</span>
                    <ChevronDown size={15} className={`transition-transform ${groupOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div
                    id={groupId}
                    className={`grid transition-[grid-template-rows] duration-200 ${groupOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-b border-white/10 py-2 pl-2">
                        {group.children.map(({ label, path }) => {
                          const active = pathname === path;

                          return (
                            <Link
                              key={label}
                              href={path}
                              aria-current={active ? "page" : undefined}
                              onClick={() => setMobileOpen(false)}
                              className={`group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                                active ? "bg-amber-400/[0.08] text-amber-300" : "text-white/85 hover:bg-white/[0.06] hover:text-white"
                              }`}
                            >
                              <span className="text-[13px] font-medium">{label}</span>
                              <ArrowUpRight size={14} className="shrink-0 text-white/30 transition-colors group-hover:text-[#F5B301]" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <a
              href={investorPortalUrl}
              data-investor-portal="true"
              data-analytics-event="investor_portal_click"
              data-analytics-location="mobile_menu"
              onClick={() => setMobileOpen(false)}
              className="mt-5 flex items-center justify-center gap-2 rounded-full border border-[#1F4ED8]/45 py-3.5 text-center text-[14px] font-semibold text-white"
            >
              <LockKeyhole size={15} aria-hidden="true" className="text-[#F5B301]" />
              {investorPortalLabel}
              <ArrowUpRight size={14} aria-hidden="true" className="text-white/40" />
            </a>

            <Link
              href={headerCta.href || "/contact"}
              data-analytics-event="primary_cta_click"
              data-analytics-location="mobile_menu"
              onClick={() => setMobileOpen(false)}
              className="gv-btn-primary mt-3 block text-center"
            >
              {headerCta.label || "Begin Your Journey"}
            </Link>

            {socialLinks.some((item) => item.locations?.mobileMenu === true && item.isVisible !== false) ? (
              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Connect with GrowVest</p>
                <SocialLinks links={socialLinks} location="mobileMenu" theme="dark" />
              </div>
            ) : null}
          </div>
        </nav>
      )}
    </header>
  );
}
