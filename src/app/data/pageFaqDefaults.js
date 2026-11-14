import { FAQS } from "./faqs";

// The starter copy below reuses questions already published in the existing
// GrowVest FAQ directory. It makes relevant answers available on each page
// immediately, while allowing the SEO team to replace them in the CMS.
// These are deliberately not guaranteed-return or personalised-advice claims.
const STARTER_QUESTIONS_BY_PAGE = {
  home: [0, 1, 6, 8],
  about: [0, 1, 2, 3],
  "bucket-list-builder": [8, 9, 11],
  "client-stories": [7, 11, 1],
  contact: [6, 13, 14],
  disclosures: [2, 3, 4, 5, 11],
  "family-wealth": [6, 7, 8, 11],
  faqs: [], // The FAQ directory already renders the whole published library.
  "for-nris": [12, 6, 11],
  "goal-library": [8, 9, 7],
  "how-we-charge": [4, 5, 2],
  insights: [2, 11, 8],
  "investor-experience": [7, 8, 11],
  "investor-experiences": [7, 11, 1],
  "privacy-policy": [14, 13, 2],
  "progress-reviews": [7, 11, 6],
  "start-here": [6, 4, 2],
  "terms-of-use": [11, 2, 14],
  "the-growvest-way": [1, 6, 7],
  "wealth-guidance": [10, 2, 11],
  "your-goals": [8, 7, 9],
  "thank-you": [13, 14],
};

export const PAGE_FAQ_DEFAULTS = Object.fromEntries(
  Object.entries(STARTER_QUESTIONS_BY_PAGE).map(([key, indices]) => [
    key,
    indices.map((index) => ({
      id: `starter-${index}`,
      question: FAQS[index].q,
      answer: FAQS[index].a,
      status: "published",
      isVisible: true,
    })),
  ]),
);

export function getPageFaqDefaults(pageKey) {
  return PAGE_FAQ_DEFAULTS[pageKey] || [];
}
