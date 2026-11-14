import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata, getSiteWebPageSchema } from "../../lib/server/sitePageSeo";
import GoalLibrary from "../../_views/GoalLibrary";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema, createItemListSchema } from "../../lib/seo";
import { getPublishedGoalLibrary } from "../../lib/server/websiteContentRepository";

export async function generateMetadata() {
  return getSitePageMetadata("/goal-library");
}

export default async function Page() {
  const goals = await getPublishedGoalLibrary();
  const pageSchema = await getSiteWebPageSchema("/goal-library", "CollectionPage");
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
      <PageContentExtensions pageKey="goal-library" />
    </>
  );
}
