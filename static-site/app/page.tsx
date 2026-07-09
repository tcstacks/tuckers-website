"use client";

import publishedContent from "../../data/site-content.json";
import { ContentProvider } from "../../app/lib/contentStore";
import { SiteShell } from "../../app/lib/SiteShell";
import type { SiteContent } from "../../app/content";

export default function StaticHome() {
  return (
    <ContentProvider initialContent={publishedContent as SiteContent}>
      <SiteShell />
    </ContentProvider>
  );
}
