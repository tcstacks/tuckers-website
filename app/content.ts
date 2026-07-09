// ============================================================
// Edit this file to update every piece of copy on the site.
// No other files need to be touched for content changes.
// ============================================================

export const content = {
  // ----- Browser tab + SEO -----
  meta: {
    title: "Tucker — Indie hacker & AI builder",
    description:
      "Tucker builds focused internet products, useful AI tools, and small experiments in public.",
  },

  // ----- Sidebar -----
  sidebar: {
    logo: "tucker",
    tagLine1: "Indie hacker & AI builder",
    tagLine2: "shipping useful things on the internet",
    status: "Building in public · always experimenting",
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
    kicker: "— Indie hacking & AI, 2026",
    headlineLine1: "Small teams,",
    headlineAccent: "useful leverage.",
    lede:
      "I build small products, AI-native tools, and experiments that make the internet a little more useful — then share what I learn along the way.",
    meta: {
      location: "California · online",
      availability: "Open to good ideas",
      email: "hello@example.com",
    },
  },

  // ----- Work / engagements section -----
  work: {
    label: "Selected builds",
    count: "04 / 12",
    items: [
      { year: "2026", title: "Prompt Bench", tag: "AI product", href: "#" },
      { year: "2025", title: "Tiny Tools", tag: "Micro-SaaS", href: "#" },
      { year: "2024", title: "Signal Garden", tag: "Experiment", href: "#" },
      { year: "2023", title: "Field Notes", tag: "Open source", href: "#" },
    ],
    seeAllLabel: "See all builds →",
    seeAllHref: "#",
  },

  // ----- Writing section -----
  writing: {
    label: "Notes & writing",
    count: "03 / 10",
    items: [
      {
        title: "What I learned shipping a tiny AI product",
        date: "May 2026",
        href: "#",
      },
      {
        title: "A practical case for smaller software",
        date: "Mar 2026",
        href: "#",
      },
      {
        title: "Notes on building in public",
        date: "Jan 2026",
        href: "#",
      },
    ],
  },

  // ----- Contact section -----
  contact: {
    label: "Contact",
    email: "hello@example.com",
    note: "Interested in a project, collaboration, or a strange idea? I’d love to hear it.",
  },

  // ----- Footer -----
  footer: {
    left: "© 2026 Tucker",
    right: "Building in public · 2026",
  },
};

export type SiteContent = typeof content;
