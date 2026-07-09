"use client";

import { ContentProvider } from "./lib/contentStore";
import { EditToolbar } from "./lib/Editor";
import { SiteShell } from "./lib/SiteShell";

const editorEnabled = process.env.NEXT_PUBLIC_ENABLE_EDITOR === "true";

export default function Home() {
  return (
    <ContentProvider>
      <SiteShell />
      {editorEnabled ? <EditToolbar /> : null}
    </ContentProvider>
  );
}
