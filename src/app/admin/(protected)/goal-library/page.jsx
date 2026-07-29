import { requireAdminPage } from "../../../lib/server/adminAuth";
import { listGoalLibrary } from "../../../lib/server/websiteContentRepository";
import { GoalLibraryManager } from "../../_components/GoalLibraryManager";
export const dynamic = "force-dynamic";
export default async function AdminGoalLibraryPage() { await requireAdminPage("website.manage"); return <GoalLibraryManager initialItems={await listGoalLibrary()} />; }
