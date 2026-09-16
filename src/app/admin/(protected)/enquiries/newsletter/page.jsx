import { EnquiriesPageServer } from "../../../_components/EnquiriesPageServer";
export const dynamic = "force-dynamic";
export default function NewsletterEnquiriesPage() { return <EnquiriesPageServer title="Newsletter subscribers" description="Track consented newsletter subscriptions and Brevo synchronization status." filters={{ source: "newsletter" }} />; }
