import { EnquiriesPageServer } from "../../../_components/EnquiriesPageServer";
export const dynamic = "force-dynamic";
export default function BucketListEnquiriesPage() { return <EnquiriesPageServer title="Bucket List leads" description="Review life goals, illustrative monthly estimates and follow-up requirements submitted through the Bucket List Builder." filters={{ source: "bucket" }} />; }
