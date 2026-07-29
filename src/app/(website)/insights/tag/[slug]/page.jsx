import { redirect } from "next/navigation";
export default async function TagPage({params}){const {slug}=await params;redirect(`/insights?search=${encodeURIComponent(slug.replaceAll('-',' '))}`)}
