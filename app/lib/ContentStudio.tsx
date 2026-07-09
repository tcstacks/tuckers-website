"use client";

import {
  useEffect,
  useRef,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useContent } from "./contentStore";

type FieldProps = {
  label: string;
  path: string;
  value: string;
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
};

function Field({
  label,
  path,
  value,
  multiline = false,
  placeholder,
  hint,
}: FieldProps) {
  const { set } = useContent();
  const shared = {
    id: path,
    value,
    placeholder,
    onChange: (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => set(path, event.target.value),
  };

  return (
    <label className={`studioField ${multiline ? "wide" : ""}`} htmlFor={path}>
      <span className="studioFieldLabel">{label}</span>
      {multiline ? <textarea {...shared} rows={3} /> : <input {...shared} />}
      {hint && <span className="studioFieldHint">{hint}</span>}
    </label>
  );
}

function StudioSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="studioSection" id={`studio-${id}`}>
      <div className="studioSectionIntro">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="studioFields">{children}</div>
    </section>
  );
}

function ItemActions({
  path,
  index,
  length,
}: {
  path: string;
  index: number;
  length: number;
}) {
  const { moveItem, removeItem } = useContent();
  return (
    <div className="studioItemActions">
      <button
        type="button"
        onClick={() => moveItem(path, index, -1)}
        disabled={index === 0}
        aria-label="Move item up"
        title="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={() => moveItem(path, index, 1)}
        disabled={index === length - 1}
        aria-label="Move item down"
        title="Move down"
      >
        ↓
      </button>
      <button
        type="button"
        className="danger"
        onClick={() => removeItem(path, index)}
        aria-label="Delete item"
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}

const outline = [
  ["identity", "Site identity"],
  ["hero", "Intro"],
  ["projects", "Projects"],
  ["writing", "Writing"],
  ["contact", "Contact"],
  ["navigation", "Navigation"],
  ["footer", "Footer"],
];

export function ContentStudio({ previewHref }: { previewHref?: string }) {
  const {
    content,
    editMode,
    setEditMode,
    saveState,
    savedAt,
    saveNow,
    addItem,
    reset,
    exportContent,
    importContent,
  } = useContent();
  const importRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!editMode) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    canvasRef.current?.scrollTo({ top: 0 });
    return () => {
      document.body.style.overflow = previous;
    };
  }, [editMode]);

  if (!editMode) return null;

  const savedLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "error"
        ? "Couldn’t save"
        : savedAt
          ? `Saved ${savedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
          : "All changes saved";

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const value = JSON.parse(await file.text());
      if (!importContent(value)) throw new Error("Invalid content file");
    } catch {
      alert("That file doesn’t look like a site content backup.");
    } finally {
      event.target.value = "";
    }
  };

  const preview = async () => {
    const saved = await saveNow();
    if (saved && previewHref) {
      window.location.assign(previewHref);
      return;
    }
    if (saved) setEditMode(false);
  };

  const signOut = async () => {
    await saveNow();
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin");
  };

  return (
    <div className="contentStudio" role="dialog" aria-modal="true" aria-label="Content editor">
      <header className="studioTopbar">
        <div className="studioBrand">
          <span className="studioDocIcon" aria-hidden="true">T</span>
          <div>
            <strong>Site content</strong>
            <span>{content.meta.title}</span>
          </div>
        </div>
        <div className={`saveStatus ${saveState}`} aria-live="polite">
          <span />
          {savedLabel}
        </div>
        <div className="studioActions">
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            hidden
          />
          <button type="button" className="studioTextButton" onClick={() => importRef.current?.click()}>
            Import
          </button>
          <button type="button" className="studioTextButton" onClick={exportContent}>
            Download backup
          </button>
          <button
            type="button"
            className="studioTextButton"
            onClick={() => {
              if (confirm("Replace your edits with the site defaults?")) reset();
            }}
          >
            Reset
          </button>
          <button type="button" className="studioTextButton studioLogoutButton" onClick={signOut}>
            Sign out
          </button>
          <button type="button" className="studioPreviewButton" onClick={() => void preview()}>
            Preview
          </button>
          <button type="button" className="studioSaveButton" onClick={() => void saveNow()}>
            Save
          </button>
        </div>
      </header>

      <div className="studioBody">
        <aside className="studioOutline" aria-label="Document outline">
          <p>Document outline</p>
          <nav>
            {outline.map(([id, label]) => (
              <a key={id} href={`#studio-${id}`}>{label}</a>
            ))}
          </nav>
          <div className="studioStorageNote">
            <strong>Autosave is on</strong>
            <span>Changes publish to the public site. Download a backup whenever you want a portable copy.</span>
          </div>
        </aside>

        <main className="studioCanvas" ref={canvasRef}>
          <div className="studioPaper">
            <div className="studioDocumentTitle">
              <span>CONTENT DOCUMENT</span>
              <h1>{content.sidebar.logo || "Untitled site"}</h1>
              <p>Edit the words that appear across your site. Changes save automatically as you type.</p>
            </div>

            <StudioSection
              id="identity"
              eyebrow="01"
              title="Site identity"
              description="The name and short description used in the browser, search results, and sidebar."
            >
              <Field label="Site name" path="sidebar.logo" value={content.sidebar.logo} />
              <Field label="Browser title" path="meta.title" value={content.meta.title} />
              <Field label="Primary role" path="sidebar.tagLine1" value={content.sidebar.tagLine1} />
              <Field label="Supporting line" path="sidebar.tagLine2" value={content.sidebar.tagLine2} />
              <Field label="Current status" path="sidebar.status" value={content.sidebar.status} />
              <Field
                label="Search description"
                path="meta.description"
                value={content.meta.description}
                multiline
                hint="Aim for one clear sentence under 160 characters."
              />
              <div className="studioSubsection wide">
                <div className="studioSubsectionHead">
                  <div><strong>Social links</strong><span>Label and destination URL</span></div>
                  <button
                    type="button"
                    onClick={() => addItem("sidebar.socials", { label: "New link", href: "https://" })}
                  >
                    + Add link
                  </button>
                </div>
                {content.sidebar.socials.map((item, index) => (
                  <div className="studioItemRow two" key={`social-${index}`}>
                    <Field label="Label" path={`sidebar.socials.${index}.label`} value={item.label} />
                    <Field label="URL" path={`sidebar.socials.${index}.href`} value={item.href} />
                    <ItemActions path="sidebar.socials" index={index} length={content.sidebar.socials.length} />
                  </div>
                ))}
              </div>
            </StudioSection>

            <StudioSection
              id="hero"
              eyebrow="02"
              title="Intro"
              description="Your opening statement: what you make, why it matters, and how people can reach you."
            >
              <Field label="Eyebrow" path="hero.kicker" value={content.hero.kicker} />
              <Field label="Headline, first line" path="hero.headlineLine1" value={content.hero.headlineLine1} />
              <Field label="Headline, accent line" path="hero.headlineAccent" value={content.hero.headlineAccent} />
              <Field label="Location" path="hero.meta.location" value={content.hero.meta.location} />
              <Field label="Availability" path="hero.meta.availability" value={content.hero.meta.availability} />
              <Field label="Email" path="hero.meta.email" value={content.hero.meta.email} />
              <Field label="Introduction" path="hero.lede" value={content.hero.lede} multiline />
            </StudioSection>

            <StudioSection
              id="projects"
              eyebrow="03"
              title="Projects"
              description="Products, experiments, and tools you want to feature."
            >
              <Field label="Section label" path="work.label" value={content.work.label} />
              <Field label="Project count" path="work.count" value={content.work.count} />
              <Field label="Archive link label" path="work.seeAllLabel" value={content.work.seeAllLabel} />
              <Field label="Archive URL" path="work.seeAllHref" value={content.work.seeAllHref} />
              <div className="studioSubsection wide">
                <div className="studioSubsectionHead">
                  <div><strong>Featured projects</strong><span>Reorder them with the arrow controls</span></div>
                  <button
                    type="button"
                    onClick={() => addItem("work.items", { year: new Date().getFullYear().toString(), title: "New project", tag: "Experiment", href: "#" })}
                  >
                    + Add project
                  </button>
                </div>
                {content.work.items.map((item, index) => (
                  <div className="studioItemCard" key={`project-${index}`}>
                    <div className="studioItemNumber">{String(index + 1).padStart(2, "0")}</div>
                    <div className="studioItemGrid">
                      <Field label="Project name" path={`work.items.${index}.title`} value={item.title} />
                      <Field label="Category" path={`work.items.${index}.tag`} value={item.tag} />
                      <Field label="Year" path={`work.items.${index}.year`} value={item.year} />
                      <Field label="Project URL" path={`work.items.${index}.href`} value={item.href} />
                    </div>
                    <ItemActions path="work.items" index={index} length={content.work.items.length} />
                  </div>
                ))}
              </div>
            </StudioSection>

            <StudioSection
              id="writing"
              eyebrow="04"
              title="Writing"
              description="Articles, notes, and build logs you want visitors to find."
            >
              <Field label="Section label" path="writing.label" value={content.writing.label} />
              <Field label="Article count" path="writing.count" value={content.writing.count} />
              <div className="studioSubsection wide">
                <div className="studioSubsectionHead">
                  <div><strong>Featured writing</strong><span>Keep titles short and specific</span></div>
                  <button
                    type="button"
                    onClick={() => addItem("writing.items", { title: "New article", date: "Draft", href: "#" })}
                  >
                    + Add article
                  </button>
                </div>
                {content.writing.items.map((item, index) => (
                  <div className="studioItemCard" key={`writing-${index}`}>
                    <div className="studioItemNumber">{String(index + 1).padStart(2, "0")}</div>
                    <div className="studioItemGrid">
                      <Field label="Article title" path={`writing.items.${index}.title`} value={item.title} />
                      <Field label="Date" path={`writing.items.${index}.date`} value={item.date} />
                      <Field label="Article URL" path={`writing.items.${index}.href`} value={item.href} />
                    </div>
                    <ItemActions path="writing.items" index={index} length={content.writing.items.length} />
                  </div>
                ))}
              </div>
            </StudioSection>

            <StudioSection
              id="contact"
              eyebrow="05"
              title="Contact"
              description="The closing invitation and email shown near the bottom of the page."
            >
              <Field label="Section label" path="contact.label" value={content.contact.label} />
              <Field label="Email" path="contact.email" value={content.contact.email} />
              <Field label="Contact note" path="contact.note" value={content.contact.note} multiline />
            </StudioSection>

            <StudioSection
              id="navigation"
              eyebrow="06"
              title="Navigation"
              description="The sidebar labels and numbers. Section IDs are kept stable so links continue to work."
            >
              <div className="studioSubsection wide compact">
                {content.nav.map((item, index) => (
                  <div className="studioItemRow navEdit" key={`nav-${index}`}>
                    <Field label="Number" path={`nav.${index}.num`} value={item.num} />
                    <Field label="Label" path={`nav.${index}.label`} value={item.label} />
                    <ItemActions path="nav" index={index} length={content.nav.length} />
                  </div>
                ))}
              </div>
            </StudioSection>

            <StudioSection
              id="footer"
              eyebrow="07"
              title="Footer"
              description="The small-print lines at the end of the site."
            >
              <Field label="Left line" path="footer.left" value={content.footer.left} />
              <Field label="Right line" path="footer.right" value={content.footer.right} />
            </StudioSection>
          </div>
        </main>
      </div>
    </div>
  );
}
