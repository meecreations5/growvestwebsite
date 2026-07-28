import GoalLibrary from "../_views/GoalLibrary";
import { StructuredData } from "../components/StructuredData";
import { createBreadcrumbSchema, createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata("/goal-library");

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Goal Library", path: "/goal-library" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <GoalLibrary />
    </>
  );
}
