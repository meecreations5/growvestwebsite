import Home from "./_views/Home";
import { createPageMetadata } from "./lib/seo";

export const metadata = createPageMetadata("/");

export default function Page() {
  return <Home />;
}
