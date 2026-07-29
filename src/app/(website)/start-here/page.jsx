import StartHere from "../../_views/StartHere";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema, createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata("/start-here");

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Start Here", path: "/start-here" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <StartHere />
    </>
  );
}
