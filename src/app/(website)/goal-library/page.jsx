import GoalLibrary from "../../_views/GoalLibrary";
import { StructuredData } from "../../components/StructuredData";
import { SEO_PAGES, createBreadcrumbSchema, createItemListSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";
import { getPublishedGoalLibrary } from "../../lib/server/websiteContentRepository";

export const metadata = createPageMetadata("/goal-library");

export default async function Page() {
  const goals = await getPublishedGoalLibrary();
  const pageSchema = createWebPageSchema({
    path: "/goal-library",
    name: SEO_PAGES["/goal-library"].title,
    description: SEO_PAGES["/goal-library"].description,
    type: "CollectionPage",
  });
  const itemListSchema = createItemListSchema({
    path: "/goal-library",
    name: "GrowVest Financial Goal Library",
    items: goals.map((goal) => ({
      name: goal.label,
      description: goal.description,
      url: goal.slug ? `/goal-library#${goal.slug}` : "/goal-library",
    })),
  });
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Goal Library", path: "/goal-library" },
  ]);

  return (
    <>
      <StructuredData id="growvest-goal-library-schema" data={pageSchema} />
      <StructuredData id="growvest-goal-library-items" data={itemListSchema} />
      <StructuredData id="growvest-goal-library-breadcrumb" data={breadcrumbs} />
      <GoalLibrary goals={goals} />
    </>
  );
}
