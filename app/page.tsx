import { ContentProvider } from "./lib/contentStore";
import { EditToolbar } from "./lib/Editor";
import { SiteShell } from "./lib/SiteShell";
import { readSiteContent } from "./lib/siteContentServer";

export const dynamic = "force-dynamic";
const editorEnabled = process.env.NEXT_PUBLIC_ENABLE_EDITOR === "true";

export default async function Home() {
  const initialContent = await readSiteContent();
  return (
    <ContentProvider initialContent={initialContent}>
      <SiteShell />
      {editorEnabled ? <EditToolbar /> : null}
    </ContentProvider>
  );
}
