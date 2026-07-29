import { Facebook, Instagram, Linkedin, MapPinned, MessageCircle, Share2, Youtube } from "lucide-react";

const ICONS = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  whatsapp: MessageCircle,
  google_business: MapPinned,
  x: Share2,
};

export function SocialLinks({ links = [], location = "", theme = "dark", showLabels = false, className = "" }) {
  const visible = links.filter((item) => item.isVisible !== false && (!location || item.locations?.[location] === true));
  if (!visible.length) return null;

  const dark = theme === "dark";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="GrowVest social media">
      {visible.map((item) => {
        const Icon = ICONS[item.platform] || Share2;
        return (
          <a
            key={item.id || `${item.platform}-${item.url}`}
            href={item.url}
            target={item.openInNewTab === false ? undefined : "_blank"}
            rel={item.openInNewTab === false ? undefined : "noreferrer noopener"}
            aria-label={item.label}
            title={item.label}
            data-analytics-event="social_link_click"
            data-analytics-platform={item.platform}
            data-analytics-location={location || "website"}
            className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4ED8] ${dark ? "border-white/12 bg-white/[0.05] text-white/70 hover:border-white/25 hover:text-white" : "border-gray-200 bg-white text-[#4B5563] hover:border-[#1F4ED8]/30 hover:text-[#1F4ED8]"}`}
          >
            <Icon size={15} aria-hidden="true" />
            {showLabels ? <span>{item.label}</span> : null}
          </a>
        );
      })}
    </div>
  );
}
