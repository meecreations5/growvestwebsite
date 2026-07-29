import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminRequest } from "../../../lib/server/adminAuth";
import { createTestimonial, listTestimonials } from "../../../lib/server/testimonialsRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "testimonials.read");
    return NextResponse.json({ items: await listTestimonials() });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load investor testimonials." }, { status: error?.status || 500 });
  }
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "testimonials.manage");
    const body = await readJsonBody(request, 80_000);
    const item = await createTestimonial(body, admin);
    revalidateTag("growvest-testimonials");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/insights");
    revalidatePath("/investor-experiences");
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to create the investor testimonial." }, { status: error?.status || 500 });
  }
}
