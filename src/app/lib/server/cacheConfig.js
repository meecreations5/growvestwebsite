export const PUBLIC_CACHE_TTL = Object.freeze({
  website: 3600,
  insightsList: 900,
  insight: 3600,
  taxonomy: 3600,
  guide: 900,
  appointmentAvailability: 60,
});

export const CACHE_TAGS = Object.freeze({
  websiteSettings: "growvest-website-settings",
  websiteNavigation: "growvest-website-navigation",
  faqs: "growvest-faqs",
  goalLibrary: "growvest-goal-library",
  team: "growvest-team",
  social: "growvest-social",
  testimonials: "growvest-testimonials",
  insights: "growvest-insights",
  insightTaxonomy: "growvest-insight-taxonomy",
  guideKnowledge: "growvest-guide-knowledge",
  guideSettings: "growvest-guide-settings",
  guideSources: "growvest-guide-sources",
});

export function pageCacheTag(pageKey) {
  return `growvest-page-${String(pageKey || "unknown")}`;
}

export function insightCacheTag(slug) {
  return `growvest-insight-${String(slug || "unknown")}`;
}
