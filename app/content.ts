// ============================================================
// Edit this file to update every piece of copy on the site.
// No other files need to be touched for content changes.
// ============================================================

export const content = {
  // ----- Browser tab + SEO -----
  meta: {
    title: "yourname — Offensive security engineer",
    description:
      "Offensive security engineer focused on red team operations, exploit development, and adversarial research.",
  },

  // ----- Sidebar -----
  sidebar: {
    logo: "yourname",
    tagLine1: "Offensive security engineer",
    tagLine2: "red team & exploit research",
    status: "Available for work · May 2026",
    socials: [
      { label: "GitHub", href: "#" },
      { label: "X / Twitter", href: "#" },
      { label: "Signal", href: "#" },
    ],
  },

  // ----- Sidebar nav (also drives scrollspy) -----
  nav: [
    { id: "intro", label: "Intro", num: "00" },
    { id: "work", label: "Work", num: "01" },
    { id: "writing", label: "Writing", num: "02" },
    { id: "contact", label: "Contact", num: "03" },
  ],

  // ----- Hero -----
  hero: {
    kicker: "— Offensive security, 2026",
    headlineLine1: "Quiet attacks,",
    headlineAccent: "careful research.",
    lede:
      "Offensive security engineer focused on red team operations, exploit development, and adversarial research — usually for teams that don\u2019t want to make the news.",
    meta: {
      location: "California",
      availability: "Booking Q3 — Q4",
      email: "hello@example.com",
    },
  },

  // ----- Work / engagements section -----
  work: {
    label: "Selected engagements",
    count: "04 / 28",
    items: [
      { year: "2026", title: "Aperture", tag: "Red Team", href: "#" },
      { year: "2025", title: "Riptide", tag: "Exploit Dev", href: "#" },
      { year: "2024", title: "Blackbox", tag: "Research", href: "#" },
      { year: "2023", title: "Beacon", tag: "Tooling", href: "#" },
    ],
    seeAllLabel: "See all engagements →",
    seeAllHref: "#",
  },

  // ----- Writing section -----
  writing: {
    label: "Research & writing",
    count: "03 / 14",
    items: [
      {
        title: "The patience of a good attacker",
        date: "May 2026",
        href: "#",
      },
      {
        title: "Bypassing modern EDR, gently",
        date: "Mar 2026",
        href: "#",
      },
      {
        title: "Notes from a quiet red team",
        date: "Jan 2026",
        href: "#",
      },
    ],
  },

  // ----- Contact section -----
  contact: {
    label: "Contact",
    email: "hello@example.com",
    note: "PGP available on request. Reply within a day or two.",
  },

  // ----- Footer -----
  footer: {
    left: "© 2026 yourname",
    right: "v4 · Updated May 2026",
  },
};

export type SiteContent = typeof content;
