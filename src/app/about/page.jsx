import AboutUs from "../_views/AboutUs";
import { StructuredData } from "../components/StructuredData";
import { createBreadcrumbSchema, createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata("/about");

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About GrowVest", path: "/about" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <AboutUs />
    </>
  );
}
