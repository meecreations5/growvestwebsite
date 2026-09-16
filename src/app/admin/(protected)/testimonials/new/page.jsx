import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { TestimonialEditor } from "../../../_components/TestimonialEditor";

export const dynamic = "force-dynamic";

export default async function NewTestimonialPage() {
  await requireAdminPage("testimonials.manage");
  return <TestimonialEditor />;
}
