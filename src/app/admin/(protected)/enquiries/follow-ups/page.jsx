import { EnquiriesPageServer } from "../../../_components/EnquiriesPageServer";
export const dynamic = "force-dynamic";
export default function FollowUpsPage() { return <EnquiriesPageServer title="Follow-ups due" description="A focused queue of enquiries that have reached or passed their scheduled follow-up time." filters={{ followUp: "due" }} />; }
