"use client";

import type { SiteContent } from "../content";
import { ContentStudio } from "../lib/ContentStudio";
import { ContentProvider } from "../lib/contentStore";

export function AdminWorkspace({ content }: { content: SiteContent }) {
  return (
    <ContentProvider
      initialContent={content}
      initialEditMode
      saveMode="server"
    >
      <ContentStudio previewHref="/" />
    </ContentProvider>
  );
}
