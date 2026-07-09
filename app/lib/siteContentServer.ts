import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { content as defaultContent, type SiteContent } from "../content";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIRECTORY, "site-content.json");

export function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Partial<SiteContent>;
  return Boolean(
    candidate.meta &&
      candidate.sidebar &&
      candidate.hero &&
      candidate.work &&
      candidate.writing &&
      candidate.contact &&
      candidate.footer &&
      Array.isArray(candidate.nav) &&
      Array.isArray(candidate.sidebar.socials) &&
      Array.isArray(candidate.work.items) &&
      Array.isArray(candidate.writing.items),
  );
}

export async function readSiteContent(): Promise<SiteContent> {
  try {
    const stored = JSON.parse(await readFile(DATA_FILE, "utf8"));
    return isSiteContent(stored) ? stored : defaultContent;
  } catch {
    return defaultContent;
  }
}

export async function writeSiteContent(content: SiteContent): Promise<void> {
  await mkdir(DATA_DIRECTORY, { recursive: true });
  const temporaryFile = `${DATA_FILE}.${process.pid}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  await rename(temporaryFile, DATA_FILE);
}
