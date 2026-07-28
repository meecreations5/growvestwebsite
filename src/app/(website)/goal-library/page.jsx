import GoalLibrary from "../../_views/GoalLibrary";
import { createPageMetadata } from "../../lib/seo";
import { getPublishedGoalLibrary } from "../../lib/server/websiteContentRepository";
export const metadata = createPageMetadata("/goal-library");
export default async function Page() { return <GoalLibrary goals={await getPublishedGoalLibrary()} />; }
