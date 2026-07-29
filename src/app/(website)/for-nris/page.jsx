import ForNRIs from "../../_views/ForNRIs";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema, createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata("/for-nris");

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "NRI Wealth Guidance", path: "/for-nris" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <ForNRIs />
    </>
  );
}
