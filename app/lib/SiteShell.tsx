"use client";

import { useEffect, useState } from "react";
import { useContent } from "./contentStore";
import { AddItem, EditField, ListControls } from "./Editor";

const hasLink = (href: string) => href.trim() !== "" && href !== "#";

export function SiteShell() {
  const { content, editMode } = useContent();
  const { sidebar, nav, hero, work, writing, contact, footer } = content;
  const firstNavId = nav[0]?.id ?? "intro";
  const [active, setActive] = useState(firstNavId);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]"),
    );

    const updateActiveSection = () => {
      const marker = window.scrollY + window.innerHeight * 0.35;
      let nextActive = firstNavId;

      for (const section of sections) {
        if (section.offsetTop > marker) break;
        nextActive = section.id;
      }

      setActive(nextActive);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [firstNavId]);

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
      <a className="skipLink" href="#intro">
        Skip to content
      </a>
      <div className="bg" aria-hidden="true">
        <div className="glow" />
        <div className="horizon" />
        <div className="grain" />
      </div>

      <div className="shell">
        <aside className="sidebar" aria-label="Site navigation">
          <div className="sideTop">
            <a href={`#${firstNavId}`} className="logo">
              <span className="logoDot" aria-hidden="true" />
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
                  aria-current={active === s.id ? "location" : undefined}
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
              <span className="pulse" aria-hidden="true" />
              <EditField path="sidebar.status" />
            </div>
            <div className="socials">
              {sidebar.socials.map((s, i) => {
                const linked = hasLink(s.href);
                if (!linked && !editMode) return null;

                return (
                  <div key={`${s.label}-${i}`} className="socialRow">
                    {linked ? (
                      <a href={s.href} target="_blank" rel="noreferrer">
                        <EditField path={`sidebar.socials.${i}.label`} /> ↗
                      </a>
                    ) : (
                      <span className="inactiveLink">
                        <EditField path={`sidebar.socials.${i}.label`} />
                      </span>
                    )}
                    <ListControls
                      path="sidebar.socials"
                      index={i}
                      length={sidebar.socials.length}
                    />
                  </div>
                );
              })}
              <AddItem
                path="sidebar.socials"
                template={{ label: "Link", href: "#" }}
                label="+ Link"
              />
            </div>
          </div>
        </aside>

        <main className="content">
          <section id="intro" className="intro" aria-labelledby="intro-heading">
            <EditField path="hero.kicker" as="p" className="kicker fade" />
            <h1 id="intro-heading" className="fade">
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

          <section id="work" className="section" aria-labelledby="work-heading">
            <header className="sectionHead fade">
              <h2 id="work-heading" className="label">
                <EditField path="work.label" />
              </h2>
              {hasLink(work.seeAllHref) ? (
                <EditField path="work.count" className="count" />
              ) : null}
            </header>
            <ul className="list fade">
              {work.items.map((item, i) => {
                const rowContent = (
                  <>
                    <EditField path={`work.items.${i}.year`} className="rowYear" />
                    <EditField path={`work.items.${i}.title`} className="rowTitle" />
                    <EditField path={`work.items.${i}.tag`} className="rowTag" />
                    <span className="rowArrow" aria-hidden="true">↗</span>
                  </>
                );

                return (
                  <li key={`${item.title}-${i}`} className="row">
                    {hasLink(item.href) ? (
                      <a href={item.href} className="rowLink">
                        {rowContent}
                      </a>
                    ) : (
                      <div className="rowLink rowLinkStatic">{rowContent}</div>
                    )}
                    <ListControls
                      path="work.items"
                      index={i}
                      length={work.items.length}
                    />
                  </li>
                );
              })}
            </ul>
            <AddItem
              path="work.items"
              template={{ year: "2026", title: "New", tag: "Tag", href: "#" }}
              label="+ Engagement"
            />
            {hasLink(work.seeAllHref) ? (
              <a href={work.seeAllHref} className="seeAll fade">
                <EditField path="work.seeAllLabel" />
              </a>
            ) : null}
          </section>

          <section
            id="writing"
            className="section"
            aria-labelledby="writing-heading"
          >
            <header className="sectionHead fade">
              <h2 id="writing-heading" className="label">
                <EditField path="writing.label" />
              </h2>
            </header>
            <ul className="notes fade">
              {writing.items.map((item, i) => {
                const rowContent = (
                  <>
                    <EditField
                      path={`writing.items.${i}.title`}
                      className="noteTitle"
                    />
                    <span className="noteRight">
                      <EditField
                        path={`writing.items.${i}.date`}
                        className="noteMeta"
                      />
                      <span className="noteArrow" aria-hidden="true">↗</span>
                    </span>
                  </>
                );

                return (
                  <li key={`${item.title}-${i}`} className="noteRow">
                    {hasLink(item.href) ? (
                      <a href={item.href} className="noteLink">
                        {rowContent}
                      </a>
                    ) : (
                      <div className="noteLink noteLinkStatic">{rowContent}</div>
                    )}
                    <ListControls
                      path="writing.items"
                      index={i}
                      length={writing.items.length}
                    />
                  </li>
                );
              })}
            </ul>
            <AddItem
              path="writing.items"
              template={{ title: "New post", date: "May 2026", href: "#" }}
              label="+ Post"
            />
          </section>

          <section
            id="contact"
            className="section contact"
            aria-labelledby="contact-heading"
          >
            <h2 id="contact-heading" className="label fade">
              <EditField path="contact.label" />
            </h2>
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
