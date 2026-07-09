import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../app/globals.css";
import publishedContent from "../../data/site-content.json";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: publishedContent.meta.title,
  description: publishedContent.meta.description,
};

export default function StaticLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
