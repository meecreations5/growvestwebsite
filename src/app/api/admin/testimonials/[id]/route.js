import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { archiveTestimonial, getTestimonial, updateTestimonial } from "../../../../lib/server/testimonialsRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request, "testimonials.read");
    const { id } = await params;
    const item = await getTestimonial(id);
    if (!item) return NextResponse.json({ error: "Investor testimonial not found." }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load the investor testimonial." }, { status: error?.status || 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "testimonials.manage");
    const { id } = await params;
    const body = await readJsonBody(request, 80_000);
    const item = await updateTestimonial(id, body, admin);
    revalidateTag("growvest-testimonials");
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update the investor testimonial." }, { status: error?.status || 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "testimonials.manage");
    const { id } = await params;
    await archiveTestimonial(id, admin);
    revalidateTag("growvest-testimonials");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to archive the investor testimonial." }, { status: error?.status || 500 });
  }
}
