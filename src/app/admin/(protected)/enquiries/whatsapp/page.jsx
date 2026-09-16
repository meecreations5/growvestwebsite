import { EnquiriesPageServer } from "../../../_components/EnquiriesPageServer";
export const dynamic = "force-dynamic";
export default function WhatsappEnquiriesPage() { return <EnquiriesPageServer title="WhatsApp enquiries" description="Manage WhatsApp conversations manually captured by the GrowVest team." filters={{ source: "whatsapp" }} />; }
