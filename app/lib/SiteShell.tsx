"use client";

import { useEffect, useState } from "react";
import { useContent } from "./contentStore";
import { AddItem, EditField, ListControls } from "./Editor";

const hasLink = (href: string) => {
  const value = href.trim();
  return value !== "" && value !== "#";
};

export function SiteShell() {
  const { content, editMode } = useContent();
  const {
    sidebar,
    nav,
    hero,
    experience,
    research,
    skills,
    education,
    contact,
    footer,
  } = content;
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
                        <EditField path={`sidebar.socials.${i}.label`} />{" "}
                        <span aria-hidden="true">↗</span>
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
          <section id="intro" className="intro" aria-label="Introduction">
            <EditField path="hero.kicker" as="p" className="kicker fade" />
            <EditField path="hero.lede" as="p" className="lede fade" multiline />
            <div className="introMeta fade">
              <EditField path="hero.meta.experience" />
              <span className="dot" aria-hidden="true" />
              <EditField path="hero.meta.focus" />
              <span className="dot" aria-hidden="true" />
              {hasLink(hero.meta.email) ? (
                <a href={`mailto:${hero.meta.email}`} className="metaLink">
                  <EditField path="hero.meta.email" />
                </a>
              ) : (
                <EditField path="hero.meta.email" className="metaLink" />
              )}
            </div>
          </section>

          <section
            id="experience"
            className="section"
            aria-labelledby="experience-heading"
          >
            <header className="sectionHead fade">
              <h2 id="experience-heading" className="label">
                <EditField path="experience.label" />
              </h2>
            </header>
            <div className="experienceList fade">
              {experience.items.map((item, i) => (
                <article
                  key={`${item.company}-${item.role}-${i}`}
                  className="experienceItem"
                >
                  <div className="experienceTop">
                    <EditField
                      path={`experience.items.${i}.company`}
                      as="h3"
                      className="experienceCompany"
                    />
                    <EditField
                      path={`experience.items.${i}.period`}
                      as="p"
                      className="experiencePeriod"
                    />
                    <EditField
                      path={`experience.items.${i}.location`}
                      as="p"
                      className="experienceLocation"
                    />
                  </div>
                  <EditField
                    path={`experience.items.${i}.role`}
                    as="p"
                    className="experienceRole"
                  />
                  <ul className="experienceHighlights">
                    {item.highlights.map((highlight, highlightIndex) => (
                      <li key={`${highlight}-${highlightIndex}`}>
                        <EditField
                          path={`experience.items.${i}.highlights.${highlightIndex}`}
                        />
                      </li>
                    ))}
                  </ul>
                  <ListControls
                    path="experience.items"
                    index={i}
                    length={experience.items.length}
                  />
                </article>
              ))}
            </div>
            <AddItem
              path="experience.items"
              template={{
                period: "Period",
                company: "Company",
                role: "Role",
                location: "Location",
                highlights: ["New accomplishment"],
              }}
              label="+ Experience"
            />
          </section>

          <section
            id="research"
            className="section"
            aria-labelledby="research-heading"
          >
            <header className="sectionHead fade">
              <h2 id="research-heading" className="label">
                <EditField path="research.label" />
              </h2>
            </header>
            <div className="researchList fade">
              {research.items.map((item, i) => {
                const linked = hasLink(item.href);
                const researchContent = (
                  <>
                    <div className="researchMain">
                      <EditField
                        path={`research.items.${i}.title`}
                        as="h3"
                        className="researchTitle"
                      />
                      <EditField
                        path={`research.items.${i}.description`}
                        as="p"
                        className="researchDescription"
                        multiline
                      />
                    </div>
                    <div className="researchMeta">
                      <EditField path={`research.items.${i}.date`} />
                      {linked ? <span aria-hidden="true">↗</span> : null}
                    </div>
                  </>
                );

                return (
                  <article
                    key={`${item.title}-${i}`}
                    className="researchItem"
                  >
                    {linked ? (
                      <a
                        href={item.href}
                        className="researchLink"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {researchContent}
                      </a>
                    ) : (
                      <div className="researchLink">{researchContent}</div>
                    )}
                    <ListControls
                      path="research.items"
                      index={i}
                      length={research.items.length}
                    />
                  </article>
                );
              })}
            </div>
            <AddItem
              path="research.items"
              template={{
                title: "Research title",
                date: "Date",
                description: "Research description",
                href: "",
              }}
              label="+ Research"
            />
          </section>

          <section
            id="skills"
            className="section"
            aria-labelledby="skills-heading"
          >
            <header className="sectionHead fade">
              <h2 id="skills-heading" className="label">
                <EditField path="skills.label" />
              </h2>
            </header>
            <div className="skillsGrid fade">
              {skills.groups.map((group, i) => (
                <article key={`${group.title}-${i}`} className="skillGroup">
                  <EditField
                    path={`skills.groups.${i}.title`}
                    as="h3"
                    className="skillTitle"
                  />
                  <EditField
                    path={`skills.groups.${i}.detail`}
                    as="p"
                    className="skillDetail"
                    multiline
                  />
                  <ListControls
                    path="skills.groups"
                    index={i}
                    length={skills.groups.length}
                  />
                </article>
              ))}
            </div>
            <AddItem
              path="skills.groups"
              template={{ title: "Expertise", detail: "Details" }}
              label="+ Expertise"
            />
          </section>

          <section
            id="education"
            className="section"
            aria-labelledby="education-heading"
          >
            <header className="sectionHead fade">
              <h2 id="education-heading" className="label">
                <EditField path="education.label" />
              </h2>
            </header>
            <article className="educationCard fade">
              <div className="educationTop">
                <EditField
                  path="education.school"
                  as="h3"
                  className="educationSchool"
                />
                <div className="educationMeta">
                  <EditField path="education.period" />
                  <span className="dot" aria-hidden="true" />
                  <EditField path="education.location" />
                </div>
              </div>
              <EditField
                path="education.degree"
                as="p"
                className="educationDegree"
              />
              <ul className="educationHighlights">
                {education.highlights.map((highlight, i) => (
                  <li key={`${highlight}-${i}`}>
                    <EditField path={`education.highlights.${i}`} />
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section
            id="contact"
            className="section contact"
            aria-labelledby="contact-heading"
          >
            <h2 id="contact-heading" className="label fade">
              <EditField path="contact.label" />
            </h2>
            {hasLink(contact.email) ? (
              <a href={`mailto:${contact.email}`} className="email fade">
                <EditField path="contact.email" />
              </a>
            ) : (
              <EditField path="contact.email" className="email fade" />
            )}
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
