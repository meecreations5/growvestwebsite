"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, BookOpen, Bot, CalendarClock, ChevronDown, FileEdit, FolderTree, HelpCircle, Home, Images, Inbox, LayoutDashboard, LibraryBig, LogOut, Mail, Menu, MessageCircle, MessageSquareQuote, MessageSquareText, Network, PenLine, Settings2, Share2, Tags, Target, Users, PanelsTopLeft } from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    label: "GrowVest Guide",
    icon: Bot,
    permission: "guide.read",
    children: [
      { label: "Overview", href: "/admin/growvest-guide", icon: Bot },
      { label: "Approved Answers", href: "/admin/growvest-guide/knowledge", icon: LibraryBig, permission: "guide.manage" },
      { label: "Conversations", href: "/admin/growvest-guide/conversations", icon: MessageSquareText, permission: "guide.conversations" },
      { label: "Settings", href: "/admin/growvest-guide/settings", icon: Settings2, permission: "guide.manage" },
    ],
  },
  {
    label: "Enquiries & Leads",
    icon: Inbox,
    permission: "enquiries.read",
    children: [
      { label: "Overview", href: "/admin/enquiries", icon: Inbox },
      { label: "Contact & Discovery", href: "/admin/enquiries/contact", icon: Users },
      { label: "Bucket List Leads", href: "/admin/enquiries/bucket-list", icon: Target },
      { label: "Newsletter", href: "/admin/enquiries/newsletter", icon: Mail },
      { label: "WhatsApp", href: "/admin/enquiries/whatsapp", icon: MessageCircle },
      { label: "Follow-ups Due", href: "/admin/enquiries/follow-ups", icon: CalendarClock },
    ],
  },
  {
    label: "Website Content",
    icon: PanelsTopLeft,
    permission: "website.read",
    children: [
      { label: "Overview", href: "/admin/website", icon: PanelsTopLeft },
      { label: "Homepage", href: "/admin/website/home", icon: Home, permission: "website.manage" },
      { label: "About GrowVest", href: "/admin/website/about", icon: FileEdit, permission: "website.manage" },
      { label: "Global Settings", href: "/admin/website/settings", icon: Settings2, permission: "website.manage" },
      { label: "Navigation & Footer", href: "/admin/website/navigation", icon: FolderTree, permission: "website.manage" },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle, permission: "website.manage" },
      { label: "Goal Library", href: "/admin/goal-library", icon: LibraryBig, permission: "website.manage" },
    ],
  },
  {
    label: "Insights & Blog",
    icon: BookOpen,
    children: [
      { label: "All Insights", href: "/admin/insights", icon: FileEdit },
      { label: "Add New Insight", href: "/admin/insights/new", icon: PenLine },
      { label: "Categories", href: "/admin/insights/categories", icon: FolderTree },
      { label: "Tags", href: "/admin/insights/tags", icon: Tags },
      { label: "Authors", href: "/admin/insights/authors", icon: Users },
      { label: "Analytics", href: "/admin/insights/analytics", icon: BarChart3, permission: "insights.analytics" },
    ],
  },
  { label: "Team & Hierarchy", href: "/admin/team", icon: Network, permission: "team.read" },
  { label: "Investor Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote, permission: "testimonials.read" },
  { label: "Social Media", href: "/admin/social-media", icon: Share2, permission: "social.read" },
  { label: "Media Library", href: "/admin/media", icon: Images, permission: "media.manage" },
];

function AdminLogout() {
  const [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => null);
    window.location.assign("/admin/login");
  }
  return (
    <button type="button" onClick={logout} disabled={busy} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white/60 transition hover:bg-white/8 hover:text-white disabled:opacity-60">
      <LogOut size={17} /> {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

export function AdminShell({ admin, children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({ guide: true, enquiries: true, website: true, insights: true });

  const sidebar = (
    <div className="flex h-full flex-col bg-[#0B0B0F] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/admin/dashboard" aria-label="GrowVest Website Admin" className="inline-flex">
          <img
            src="/growvest-logo-white.svg"
            alt="GrowVest"
            className="h-auto w-[150px] select-none"
            draggable="false"
          />
        </Link>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Website Admin</p>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-5">
        {nav.filter((item) => !item.permission || admin.permissions.includes(item.permission)).map((item) => {
          const Icon = item.icon;
          if (!item.children) {
            const active = pathname === item.href || (item.href === "/admin/team" && pathname.startsWith("/admin/team/")) || (item.href === "/admin/social-media" && pathname.startsWith("/admin/social-media/")) || (item.href === "/admin/testimonials" && pathname.startsWith("/admin/testimonials/"));
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? "bg-[#1F4ED8] text-white" : "text-white/60 hover:bg-white/8 hover:text-white"}`}>
                <Icon size={17} /> {item.label}
              </Link>
            );
          }
          if (item.permission && !admin.permissions.includes(item.permission)) return null;
          const groupKey = item.label.toLowerCase().includes("guide") ? "guide" : item.label.toLowerCase().includes("enquiries") ? "enquiries" : item.label.toLowerCase().includes("website") ? "website" : "insights";
          const activeGroup = groupKey === "guide" ? pathname.startsWith("/admin/growvest-guide") : groupKey === "enquiries" ? pathname.startsWith("/admin/enquiries") : groupKey === "website" ? (pathname.startsWith("/admin/website") || pathname.startsWith("/admin/faqs") || pathname.startsWith("/admin/goal-library")) : pathname.startsWith("/admin/insights");
          const groupOpen = openGroups[groupKey] !== false;
          return (
            <div key={item.label}>
              <button type="button" onClick={() => setOpenGroups((current) => ({ ...current, [groupKey]: !groupOpen }))} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${activeGroup ? "text-white" : "text-white/60 hover:bg-white/8 hover:text-white"}`}>
                <Icon size={17} />
                <span className="flex-1">{item.label}</span>
                <ChevronDown size={15} className={`transition ${groupOpen ? "rotate-180" : ""}`} />
              </button>
              {groupOpen && (
                <div className="mt-1 space-y-1 pl-4">
                  {item.children.filter((child) => !child.permission || admin.permissions.includes(child.permission)).map((child) => {
                    const ChildIcon = child.icon;
                    const active = pathname === child.href || (child.href === "/admin/insights" && /^\/admin\/insights\/[a-zA-Z0-9_-]+\/edit$/.test(pathname));
                    return (
                      <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition ${active ? "bg-white/10 text-white" : "text-white/45 hover:bg-white/6 hover:text-white/80"}`}>
                        <ChildIcon size={14} /> {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link href="/" target="_blank" className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/8 hover:text-white"><Home size={17} /> View website</Link>
        <AdminLogout />
      </div>
    </div>
  );

  return (
    <div className="gv-admin-shell min-h-screen min-w-0 overflow-x-clip bg-[#F4F6F9] text-[#0B0B0F]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] lg:block">{sidebar}</aside>
      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close navigation" className="absolute inset-0 bg-black/55" onClick={() => setMobileOpen(false)} /><aside className="relative h-full w-[min(88vw,320px)] shadow-2xl">{sidebar}</aside></div>}
      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-black/5 bg-white/90 px-4 pb-2 pt-[calc(.5rem+env(safe-area-inset-top))] backdrop-blur sm:px-5 lg:h-16 lg:px-8 lg:py-0">
          <button type="button" aria-label="Open admin navigation" onClick={() => setMobileOpen(true)} className="rounded-lg border border-gray-200 p-2 lg:hidden"><Menu size={20} /></button>
          <div className="hidden lg:block">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">GrowVest Website</p>
            <p className="text-sm font-semibold">{pathname.startsWith("/admin/growvest-guide") ? "GrowVest Guide & WhatsApp" : pathname.startsWith("/admin/enquiries") ? "Enquiries & Lead Management" : pathname.startsWith("/admin/website") || pathname.startsWith("/admin/faqs") || pathname.startsWith("/admin/goal-library") ? "Website Content Workspace" : pathname.startsWith("/admin/team") ? "Team & Hierarchy" : pathname.startsWith("/admin/testimonials") ? "Investor Testimonials" : pathname.startsWith("/admin/social-media") ? "Social Media" : pathname.startsWith("/admin/media") ? "Media Library" : "Insights & Blog Workspace"}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-sm font-semibold">{admin.displayName}</p><p className="text-[11px] capitalize text-[#6B7280]">{admin.role.replaceAll("_", " ")}</p></div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F4ED8] text-sm font-bold text-white">{(admin.displayName || "G").charAt(0).toUpperCase()}</div>
          </div>
        </header>
        <main className="min-w-0 px-4 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
