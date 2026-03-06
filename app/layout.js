import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--sans-font",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--mono-font",
});

export const metadata = {
  title: "Tucker | Developer",
  description: "Tucker Clark - Senior Red Team Operator and Security Engineer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
