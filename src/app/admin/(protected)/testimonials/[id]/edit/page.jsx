import { notFound } from "next/navigation";
import { requireAdminPage } from "../../../../../lib/server/adminAuth";
import { getTestimonial } from "../../../../../lib/server/testimonialsRepository";
import { TestimonialEditor } from "../../../../_components/TestimonialEditor";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({ params }) {
  await requireAdminPage("testimonials.manage");
  const { id } = await params;
  const item = await getTestimonial(id);
  if (!item) notFound();
  return <TestimonialEditor initialItem={item} />;
}
