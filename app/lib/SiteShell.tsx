"use client";

import { useEffect, useState } from "react";
import { useContent } from "./contentStore";
import { AddItem, EditField, ListControls } from "./Editor";

export function SiteShell() {
  const { content, editMode } = useContent();
  const { sidebar, nav, hero, work, writing, contact, footer } = content;
  const firstNavId = nav[0]?.id ?? "intro";
  const [active, setActive] = useState(firstNavId);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".fade");
    els.forEach((el, i) => {
      el.style.setProperty("--d", `${i * 60}ms`);
      requestAnimationFrame(() => el.classList.add("in"));
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={editMode ? "editing" : ""}
      onClickCapture={(e) => {
        if (!editMode) return;
        const target = e.target as HTMLElement | null;
        if (!target) return;
        if (target.closest(".editToolbar, .rowControls, .addItem")) return;
        const anchor = target.closest("a");
        if (anchor) e.preventDefault();
      }}
    >
      <div className="bg" aria-hidden="true">
        <div className="glow" />
        <div className="horizon" />
        <div className="grain" />
      </div>

      <div className="shell">
        <aside className="sidebar">
          <div className="sideTop">
            <a href={`#${firstNavId}`} className="logo">
              <span className="logoDot" />
              <EditField path="sidebar.logo" />
            </a>
            <p className="sideTag">
              <EditField path="sidebar.tagLine1" /><br />
              <EditField path="sidebar.tagLine2" className="muted" />
            </p>
          </div>

          <nav className="nav" aria-label="Primary">
            {nav.map((s, i) => (
              <div className="navRow" key={`${s.id}-${i}`}>
                <a
                  href={`#${s.id}`}
                  className={`navItem ${active === s.id ? "active" : ""}`}
                >
                  <EditField path={`nav.${i}.num`} className="navNum" />
                  <span className="navTick" />
                  <EditField path={`nav.${i}.label`} className="navLabel" />
                </a>
                <ListControls path="nav" index={i} length={nav.length} />
              </div>
            ))}
            <AddItem
              path="nav"
              template={{ id: "section", label: "Section", num: "00" }}
              label="+ Section"
            />
          </nav>

          <div className="sideFoot">
            <div className="status">
              <span className="pulse" />
              <EditField path="sidebar.status" />
            </div>
            <div className="socials">
              {sidebar.socials.map((s, i) => (
                <div key={`${s.label}-${i}`} className="socialRow">
                  <a href={s.href}>
                    <EditField path={`sidebar.socials.${i}.label`} /> ↗
                  </a>
                  <ListControls
                    path="sidebar.socials"
                    index={i}
                    length={sidebar.socials.length}
                  />
                </div>
              ))}
              <AddItem
                path="sidebar.socials"
                template={{ label: "Link", href: "#" }}
                label="+ Link"
              />
            </div>
          </div>
        </aside>

        <main className="content">
          <section id="intro" className="intro">
            <EditField path="hero.kicker" as="p" className="kicker fade" />
            <h1 className="fade">
              <EditField path="hero.headlineLine1" /><br />
              <EditField path="hero.headlineAccent" className="accent" />
            </h1>
            <EditField path="hero.lede" as="p" className="lede fade" multiline />
            <div className="introMeta fade">
              <EditField path="hero.meta.location" />
              <span className="dot" />
              <EditField path="hero.meta.availability" />
              <span className="dot" />
              <a href={`mailto:${hero.meta.email}`} className="metaLink">
                <EditField path="hero.meta.email" />
              </a>
            </div>
          </section>

          <section id="work" className="section">
            <header className="sectionHead fade">
              <EditField path="work.label" as="p" className="label" />
              <EditField path="work.count" className="count" />
            </header>
            <ul className="list fade">
              {work.items.map((item, i) => (
                <li key={`${item.title}-${i}`} className="row">
                  <EditField path={`work.items.${i}.year`} className="rowYear" />
                  <EditField path={`work.items.${i}.title`} className="rowTitle" />
                  <EditField path={`work.items.${i}.tag`} className="rowTag" />
                  <span className="rowArrow">→</span>
                  <ListControls
                    path="work.items"
                    index={i}
                    length={work.items.length}
                  />
                </li>
              ))}
            </ul>
            <AddItem
              path="work.items"
              template={{ year: "2026", title: "New", tag: "Tag", href: "#" }}
              label="+ Engagement"
            />
            <a href={work.seeAllHref} className="seeAll fade">
              <EditField path="work.seeAllLabel" />
            </a>
          </section>

          <section id="writing" className="section">
            <header className="sectionHead fade">
              <EditField path="writing.label" as="p" className="label" />
              <EditField path="writing.count" className="count" />
            </header>
            <ul className="notes fade">
              {writing.items.map((item, i) => (
                <li key={`${item.title}-${i}`}>
                  <a href={item.href}>
                    <EditField path={`writing.items.${i}.title`} />
                  </a>
                  <span className="noteRight">
                    <EditField
                      path={`writing.items.${i}.date`}
                      className="noteMeta"
                    />
                    <ListControls
                      path="writing.items"
                      index={i}
                      length={writing.items.length}
                    />
                  </span>
                </li>
              ))}
            </ul>
            <AddItem
              path="writing.items"
              template={{ title: "New post", date: "May 2026", href: "#" }}
              label="+ Post"
            />
          </section>

          <section id="contact" className="section contact">
            <EditField path="contact.label" as="p" className="label fade" />
            <a href={`mailto:${contact.email}`} className="email fade">
              <EditField path="contact.email" />
            </a>
            <EditField
              path="contact.note"
              as="p"
              className="contactNote fade"
              multiline
            />
          </section>

          <footer className="foot">
            <EditField path="footer.left" />
            <EditField path="footer.right" />
          </footer>
        </main>
      </div>
    </div>
  );
}
