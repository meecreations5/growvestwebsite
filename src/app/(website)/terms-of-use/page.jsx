import { LegalPage } from "../../components/LegalPage";
import { StructuredData } from "../../components/StructuredData";
import { COMPANY } from "../../lib/brand";
import { createBreadcrumbSchema, createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata("/terms-of-use");

const sections = [
  {
    id: "website-purpose",
    title: "Website Purpose",
    content: [
      "The GrowVest website provides general information, educational content, goal-planning tools and ways to contact the GrowVest team.",
      "GrowVest is not registered with SEBI as an Investment Adviser. Website content must not be treated as personalised securities advice, a guaranteed recommendation or an offer to buy or sell any financial instrument.",
    ],
  },
  {
    id: "certification-context",
    title: "Certification and Service Context",
    content: [
      "A member of the GrowVest team holds a valid NISM-Series-V-A Mutual Fund Distributors Certification. This certification is different from SEBI Investment Adviser registration and does not by itself establish an AMFI ARN or EUIN for GrowVest.",
      "Any regulated, distribution, transaction, tax or legal service should proceed only through an appropriately qualified, registered and clearly disclosed arrangement where required.",
    ],
  },
  {
    id: "tools-and-estimates",
    title: "Tools, Illustrations and Estimates",
    content: [
      "Calculators, goal estimates, assumed returns, timelines and illustrative journeys are educational aids. They may not include inflation, taxes, charges, existing assets, changing contributions or every personal circumstance.",
      "Results are not guarantees, forecasts or promises of investment performance or goal achievement.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    content: [
      "You agree not to misuse the website, attempt unauthorised access, introduce malicious code, disrupt availability, scrape protected content at scale or submit false, unlawful or abusive information through forms.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: [
      "The GrowVest name, logo, design, written content, illustrations and website presentation are owned by or licensed to GrowVest unless otherwise stated. They may not be reproduced or commercially reused without written permission.",
    ],
  },
  {
    id: "third-party-services",
    title: "Third-Party Services and Links",
    content: [
      "The website may link to the Investor Portal, email providers, analytics services or other third-party platforms. GrowVest does not control every third-party service and their own terms, availability and privacy practices apply.",
    ],
  },
  {
    id: "availability-and-liability",
    title: "Availability and Responsibility",
    content: [
      "GrowVest may update, correct, suspend or withdraw website content or features without prior notice. Continuous, uninterrupted or error-free availability is not guaranteed.",
      "Visitors remain responsible for verifying information and obtaining appropriately qualified advice before making financial, legal, tax or investment decisions.",
    ],
  },
  {
    id: "changes-and-contact",
    title: "Changes and Contact",
    content: [
      `These terms may be updated as the website and GrowVest services evolve. Questions may be sent to ${COMPANY.email} or raised through the Contact page.`,
    ],
  },
];

export default function TermsOfUsePage() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Terms of Use", path: "/terms-of-use" },
  ]);

  return (
    <>
      <StructuredData id="terms-breadcrumb-schema" data={breadcrumbs} />
      <LegalPage
        eyebrow="Website Terms"
        title="Terms of Use"
        introduction="These terms explain the context in which visitors may access GrowVest content, tools, forms and linked services."
        sections={sections}
      />
    </>
  );
}
