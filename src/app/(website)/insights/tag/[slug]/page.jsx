import { permanentRedirect } from "next/navigation";
export default async function TagPage({params}){const {slug}=await params;permanentRedirect(`/insights?search=${encodeURIComponent(slug.replaceAll('-',' '))}`)}
