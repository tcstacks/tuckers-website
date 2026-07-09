"use client";

import { ContentProvider } from "./lib/contentStore";
import { EditToolbar } from "./lib/Editor";
import { SiteShell } from "./lib/SiteShell";

export default function Home() {
  return (
    <ContentProvider>
      <SiteShell />
      <EditToolbar />
    </ContentProvider>
  );
}
