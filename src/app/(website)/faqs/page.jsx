import FAQs from "../../_views/FAQs";
import { createPageMetadata } from "../../lib/seo";
import { getPublishedFaqs } from "../../lib/server/websiteContentRepository";
export const metadata = createPageMetadata("/faqs");
export default async function Page() { return <FAQs items={await getPublishedFaqs()} />; }
