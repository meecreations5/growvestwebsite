import { EnquiriesPageServer } from "../../../_components/EnquiriesPageServer";
export const dynamic = "force-dynamic";
export default function ContactEnquiriesPage() { return <EnquiriesPageServer title="Contact & discovery enquiries" description="Review discovery-conversation requests submitted through the GrowVest contact experience." filters={{ source: "contact" }} />; }
