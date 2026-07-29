import TheGrowVestWay from "../../_views/TheGrowVestWay";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema, createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata("/the-growvest-way");

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "The GrowVest Way", path: "/the-growvest-way" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <TheGrowVestWay />
    </>
  );
}
