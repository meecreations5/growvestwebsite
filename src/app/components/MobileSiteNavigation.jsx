"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  Home,
  Lightbulb,
  LockKeyhole,
  Menu,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { COMPANY, NAV_GROUPS } from "../lib/brand";
import { SocialLinks } from "./SocialLinks";

function normalizePath(value) {
  const source = String(value || "/").trim();
  if (!source.startsWith("/")) return source;
  const path = source.split("?")[0].split("#")[0] || "/";
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function routeMatches(pathname, target, exact = false) {
  const current = normalizePath(pathname);
  const destination = normalizePath(target);
  if (!destination.startsWith("/")) return false;
  if (exact || destination === "/") return current === destination;
  return current === destination || current.startsWith(`${destination}/`);
}

function normalizeNavigationGroups(navigation) {
  const sourceGroups = navigation?.groups?.length ? navigation.groups : NAV_GROUPS;
  return [...sourceGroups]
    .map((group, index) => ({
      ...group,
      displayOrder: Number.isFinite(Number(group.displayOrder)) ? Number(group.displayOrder) : index,
      children: (group.children || [])
        .map((item) => ({ ...item, path: item.path || item.href || "" }))
        .filter((item) => item.label && item.path),
    }))
    .filter((group) => group.label && group.children.length)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

function groupContainsPath(group, pathname) {
  return Boolean(group?.children?.some((item) => routeMatches(pathname, item.path)));
}

function groupContainsDestination(group, destination) {
  const target = normalizePath(destination);
  return Boolean(group?.children?.some((item) => {
    const path = normalizePath(item.path);
    return path === target || path.startsWith(`${target}/`);
  }));
}

function preferredPath(group, preferred, fallback) {
  return group?.children?.find((item) => normalizePath(item.path) === preferred)?.path
    || group?.children?.[0]?.path
    || fallback;
}

function NavItem({ href, label, active, Icon, primary = false, onClick }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={primary ? `Start: ${label}` : label}
      onClick={onClick}
      className={`gv-mobile-bottom-nav__item ${primary ? "gv-mobile-bottom-nav__item--primary" : ""} ${active ? "gv-mobile-bottom-nav__item--active" : ""}`}
    >
      <span className="gv-mobile-bottom-nav__icon" aria-hidden="true">
        <Icon size={primary ? 20 : 19} strokeWidth={primary ? 2.2 : 1.9} />
      </span>
      <span className="gv-mobile-bottom-nav__label">{primary ? "Start" : label}</span>
    </Link>
  );
}

export function MobileSiteNavigation({ socialLinks = [], navigation = null, settings = null }) {
  const pathname = usePathname() || "/";
  const groups = useMemo(() => normalizeNavigationGroups(navigation), [navigation]);
  const goalsGroup = useMemo(
    () => groups.find((group) => (
      groupContainsDestination(group, "/your-goals")
      || String(group.label).toLowerCase().includes("goal")
    )) || null,
    [groups],
  );
  const insightsGroup = useMemo(
    () => groups.find((group) => (
      groupContainsDestination(group, "/insights")
      || String(group.label).toLowerCase().includes("insight")
    )) || null,
    [groups],
  );
  const goalsHref = preferredPath(goalsGroup, "/your-goals", "/your-goals");
  const insightsHref = preferredPath(insightsGroup, "/insights", "/insights");
  const primaryCta = navigation?.headerPrimaryCta || { label: "Begin Your Journey", href: "/contact" };
  const primaryHref = primaryCta.href || "/contact";
  const investorPortalUrl = settings?.investorPortalUrl || COMPANY.investorPortalUrl;
  const investorPortalLabel = navigation?.investorPortalLabel || "Investor Portal";
  const showInvestorPortal = process.env.NEXT_PUBLIC_SHOW_INVESTOR_PORTAL === "true";
  const activeGroup = groups.find((group) => groupContainsPath(group, pathname)) || null;
  const homeActive = routeMatches(pathname, "/", true);
  const startActive = !homeActive && routeMatches(pathname, primaryHref, true);
  const goalsActive = !homeActive && !startActive
    && (groupContainsPath(goalsGroup, pathname) || routeMatches(pathname, "/your-goals"));
  const insightsActive = !homeActive && !startActive && !goalsActive
    && (groupContainsPath(insightsGroup, pathname) || routeMatches(pathname, "/insights"));
  const secondaryRouteActive = !homeActive && !goalsActive && !insightsActive && !startActive;
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(activeGroup?.label || goalsGroup?.label || groups[0]?.label || null);
  const [guideOpen, setGuideOpen] = useState(false);
  const moreButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(activeGroup?.label || goalsGroup?.label || groups[0]?.label || null);
  }, [pathname, activeGroup?.label, goalsGroup?.label, groups]);

  useEffect(() => {
    const handleGuideState = (event) => {
      const nextOpen = Boolean(event.detail?.open);
      setGuideOpen(nextOpen);
      if (nextOpen) setMenuOpen(false);
    };

    setGuideOpen(document.body.dataset.growvestGuideOpen === "true");
    window.addEventListener("growvest-guide-state", handleGuideState);
    return () => window.removeEventListener("growvest-guide-state", handleGuideState);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const handleViewportChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };

    handleViewportChange(media);
    media.addEventListener?.("change", handleViewportChange);
    return () => media.removeEventListener?.("change", handleViewportChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("gv-mobile-nav-open", menuOpen);
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const inertTargets = [
      document.querySelector("header"),
      document.querySelector("#main-content"),
      document.querySelector("[data-site-footer]"),
    ].filter(Boolean);
    const previousInert = inertTargets.map((element) => Boolean(element.inert));

    document.body.style.overflow = "hidden";
    inertTargets.forEach((element) => {
      element.inert = true;
    });

    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      window.requestAnimationFrame(() => moreButtonRef.current?.focus());
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("gv-mobile-nav-open");
      inertTargets.forEach((element, index) => {
        element.inert = previousInert[index];
      });
    };
  }, [menuOpen]);

  function closeMenu({ restoreFocus = false } = {}) {
    setMenuOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => moreButtonRef.current?.focus());
  }

  function toggleMenu() {
    setOpenGroup(activeGroup?.label || openGroup || goalsGroup?.label || groups[0]?.label || null);
    setMenuOpen((current) => !current);
  }

  return (
    <>
      {menuOpen && !guideOpen ? (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close mobile navigation"
            className="gv-mobile-nav-overlay md:hidden"
            onClick={() => closeMenu({ restoreFocus: true })}
          />

          <section
            id="growvest-mobile-navigation-sheet"
            role="dialog"
            aria-label="Explore GrowVest"
            className="gv-mobile-nav-sheet md:hidden"
          >
            <div className="gv-mobile-nav-sheet__handle" aria-hidden="true" />

            <div className="gv-mobile-nav-sheet__header">
              <div className="min-w-0">
                <p className="gv-mobile-nav-sheet__eyebrow">Explore GrowVest</p>
                <h2 className="gv-mobile-nav-sheet__title">Navigate with clarity</h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close navigation"
                className="gv-mobile-nav-sheet__close"
                onClick={() => closeMenu({ restoreFocus: true })}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="gv-mobile-nav-sheet__scroll">
              <div className="gv-mobile-nav-sheet__quick-actions">
                {showInvestorPortal ? (
                  <a
                    href={investorPortalUrl}
                    data-investor-portal="true"
                    data-analytics-event="investor_portal_click"
                    data-analytics-location="mobile_bottom_sheet"
                    className="gv-mobile-nav-sheet__quick-action"
                    onClick={() => closeMenu()}
                  >
                    <span className="gv-mobile-nav-sheet__quick-icon" aria-hidden="true">
                      <LockKeyhole size={17} />
                    </span>
                    <span className="min-w-0">
                      <strong>{investorPortalLabel}</strong>
                      <small>Secure access</small>
                    </span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ) : null}

                <Link
                  href={primaryHref}
                  data-analytics-event="primary_cta_click"
                  data-analytics-location="mobile_bottom_sheet"
                  className="gv-mobile-nav-sheet__quick-action gv-mobile-nav-sheet__quick-action--primary"
                  onClick={() => closeMenu()}
                >
                  <span className="gv-mobile-nav-sheet__quick-icon" aria-hidden="true">
                    <Sparkles size={17} />
                  </span>
                  <span className="min-w-0">
                    <strong>{primaryCta.label || "Begin Your Journey"}</strong>
                    <small>Speak with GrowVest</small>
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>

              <div className="gv-mobile-nav-sheet__groups">
                {groups.map((group, groupIndex) => {
                  const groupOpen = openGroup === group.label;
                  const groupActive = groupContainsPath(group, pathname);
                  const groupId = `mobile-sheet-${String(group.label).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${groupIndex}`;

                  return (
                    <div
                      key={`${group.label}-${groupIndex}`}
                      className={`gv-mobile-nav-group ${groupActive ? "gv-mobile-nav-group--active" : ""}`}
                    >
                      <button
                        type="button"
                        aria-expanded={groupOpen}
                        aria-controls={groupId}
                        className="gv-mobile-nav-group__trigger"
                        onClick={() => setOpenGroup(groupOpen ? null : group.label)}
                      >
                        <span className="min-w-0 text-left">
                          <strong>{group.label}</strong>
                          {group.eyebrow ? <small>{group.eyebrow}</small> : null}
                        </span>
                        <ChevronDown
                          size={18}
                          aria-hidden="true"
                          className={groupOpen ? "rotate-180" : ""}
                        />
                      </button>

                      <div id={groupId} hidden={!groupOpen} className="gv-mobile-nav-group__links">
                        {group.children.map((item) => {
                          const active = routeMatches(pathname, item.path);
                          return (
                            <Link
                              key={`${group.label}-${item.label}`}
                              href={item.path}
                              aria-current={active ? "page" : undefined}
                              className={`gv-mobile-nav-group__link ${active ? "gv-mobile-nav-group__link--active" : ""}`}
                              onClick={() => closeMenu()}
                            >
                              <span>{item.label}</span>
                              <ArrowUpRight size={15} aria-hidden="true" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {socialLinks.some((item) => item.locations?.mobileMenu === true && item.isVisible !== false) ? (
                <div className="gv-mobile-nav-sheet__social">
                  <p>Connect with GrowVest</p>
                  <SocialLinks links={socialLinks} location="mobileMenu" theme="light" />
                </div>
              ) : null}
            </div>
          </section>
        </>
      ) : null}

      <nav
        aria-label="Mobile primary navigation"
        aria-hidden={guideOpen}
        inert={guideOpen ? true : undefined}
        className={`gv-mobile-bottom-nav md:hidden ${guideOpen ? "gv-mobile-bottom-nav--hidden" : ""}`}
      >
        <NavItem href="/" label="Home" active={homeActive} Icon={Home} onClick={() => closeMenu()} />
        <NavItem href={goalsHref} label="Goals" active={goalsActive} Icon={Target} onClick={() => closeMenu()} />
        <NavItem
          href={primaryHref}
          label={primaryCta.label || "Begin Your Journey"}
          active={startActive}
          Icon={Sparkles}
          primary
          onClick={() => closeMenu()}
        />
        <NavItem href={insightsHref} label="Insights" active={insightsActive} Icon={Lightbulb} onClick={() => closeMenu()} />
        <button
          ref={moreButtonRef}
          type="button"
          aria-label={menuOpen ? "Close more navigation" : "Open more navigation"}
          aria-current={secondaryRouteActive ? "location" : undefined}
          aria-pressed={menuOpen}
          aria-expanded={menuOpen}
          aria-controls="growvest-mobile-navigation-sheet"
          className={`gv-mobile-bottom-nav__item ${menuOpen || secondaryRouteActive ? "gv-mobile-bottom-nav__item--active" : ""}`}
          onClick={toggleMenu}
        >
          <span className="gv-mobile-bottom-nav__icon" aria-hidden="true">
            <Menu size={19} strokeWidth={1.9} />
          </span>
          <span className="gv-mobile-bottom-nav__label">More</span>
        </button>
      </nav>
    </>
  );
}
