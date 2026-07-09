import type { Metadata } from "next";
import { hasAdminConfig, isAdminAuthenticated } from "../lib/adminAuth";
import { readSiteContent } from "../lib/siteContentServer";
import { AdminLogin } from "./AdminLogin";
import { AdminWorkspace } from "./AdminWorkspace";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site admin — Tucker",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    return <AdminLogin configured={hasAdminConfig()} />;
  }

  return <AdminWorkspace content={await readSiteContent()} />;
}
