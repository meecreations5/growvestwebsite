import { LegalPage } from "../../components/LegalPage";
import { StructuredData } from "../../components/StructuredData";
import { COMPANY } from "../../lib/brand";
import { createBreadcrumbSchema, createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata("/privacy-policy");

const sections = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: [
      "GrowVest may collect information that you choose to provide through contact, newsletter, discovery-conversation and goal-planning forms.",
    ],
    items: [
      "Name, email address, telephone number and preferred contact details.",
      "Goal, enquiry, appointment and message information submitted by you.",
      "Technical information such as browser, device, page and interaction data when optional analytics are accepted.",
      "Operational records required to respond to enquiries and maintain communication history.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "How We Use Information",
    content: [
      "Information is used to respond to your request, arrange conversations, send requested communication, improve the website and maintain appropriate business records.",
      "GrowVest does not ask visitors to submit passwords, OTPs, card details, trading credentials or other account-access secrets through the public website.",
    ],
  },
  {
    id: "analytics-and-cookies",
    title: "Analytics and Cookies",
    content: [
      "Optional Firebase Analytics is initialized only after a visitor accepts analytics through the website preference banner. The preference is stored in the visitor's browser.",
      "Firebase Analytics may help GrowVest understand page visits, navigation, scroll depth and conversion interactions. Visitors may decline analytics and continue using the website without losing essential functionality.",
    ],
  },
  {
    id: "service-providers",
    title: "Service Providers",
    content: [
      "GrowVest may use service providers for website hosting, Firebase data storage, Brevo email delivery, Firebase Analytics, calendars and customer communication. These providers process information only for the relevant service and under their own contractual and privacy obligations.",
    ],
  },
  {
    id: "retention-and-security",
    title: "Retention and Security",
    content: [
      "Information is retained only for as long as reasonably necessary for the stated purpose, business record keeping, dispute handling or applicable legal requirements.",
      "GrowVest uses reasonable administrative and technical safeguards, but no internet transmission or storage system can be guaranteed to be completely secure.",
    ],
  },
  {
    id: "your-choices",
    title: "Your Choices",
    content: [
      `You may request access, correction or deletion of information submitted through the website by contacting ${COMPANY.email}. Requests will be reviewed subject to identity verification and applicable record-retention requirements.`,
      "You may unsubscribe from marketing communication using the unsubscribe option provided in the message or by contacting GrowVest.",
    ],
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    content: [
      "The website may link to the GrowVest Investor Portal or other third-party websites. Their own privacy notices and security practices apply when you leave this website.",
    ],
  },
  {
    id: "contact",
    title: "Privacy Contact",
    content: [
      `${COMPANY.legalName} — ${COMPANY.email}, ${COMPANY.phoneDisplay}. Postal correspondence may be sent to the office address listed on the Contact page.`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ]);

  return (
    <>
      <StructuredData id="privacy-breadcrumb-schema" data={breadcrumbs} />
      <LegalPage
        eyebrow="Privacy & Data"
        title="Privacy Policy"
        introduction="This policy explains how GrowVest handles information submitted through the public website and optional analytics preferences."
        sections={sections}
      />
    </>
  );
}
