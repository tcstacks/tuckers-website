"use client";

import { useEffect } from "react";
import SnakeGame from "../components/SnakeGame";

const experience = [
  {
    name: "TikTok · Senior Penetration Tester",
    tag: "2025-present",
    description:
      "Scaled continuous automated penetration testing across 4 tenancies (~137K hosts), integrated findings into SOC and BAS pipelines, and led PCI DSS testing across 200K+ hosts.",
  },
  {
    name: "Google (Mandiant) · Senior Red Team Consultant",
    tag: "2022-2025",
    description:
      "Launched Mandiant's first LLM penetration testing service line, emulated advanced threat actor TTPs, and co-authored AI red teaming research published in M-TRENDS 2024.",
  },
  {
    name: "Tennessee Valley Authority · Cybersecurity Analyst",
    tag: "2020-2022",
    description:
      "Ran BAS programs, managed a government vulnerability disclosure program via HackerOne, and automated mobile risk analysis for 3,880 users and applications.",
  },
];

const independentProjects = [
  {
    name: "Automated Red Team Pipeline",
    tag: "security",
    description:
      "Personal lab for continuous attack simulation, detection validation, and report generation across cloud and internal environments.",
  },
  {
    name: "WAF Validation Harness",
    tag: "tooling",
    description:
      "Payload testing framework for measuring allow/block behavior by vulnerability class and tracking baseline control effectiveness over time.",
  },
  {
    name: "AI Security Testbed",
    tag: "ai",
    description:
      "Independent environment for evaluating prompt injection, data leakage, and abuse scenarios in LLM-backed applications.",
  },
];

const skills = [
  "Red Teaming",
  "Penetration Testing",
  "EDR Evasion",
  "C2 Infrastructure",
  "AI/ML Security",
  "Python",
  "JavaScript",
  "CSS",
  "C++",
  "OSWA",
  "OSWP",
  "Mandiant CRT",
  "PNPT",
  "CISA RVA/HVA",
  "Linux",
];

const whatImWorkingOn = [
  {
    title: "Continuous Red Team Lab",
    status: "in progress",
    description:
      "Building a self-hosted attack simulation environment with automated detections, replayable scenarios, and weekly control validation runs.",
  },
  {
    title: "LLM App Security Playbook",
    status: "research",
    description:
      "Documenting practical offensive test cases for prompt injection, tool abuse, data exfiltration, and weak authorization patterns in agentic workflows.",
  },
  {
    title: "WAF Evasion Test Corpus",
    status: "active",
    description:
      "Expanding payload libraries and benchmarking bypass behavior across rule sets to track defensive drift over time.",
  },
];

function Projects({ items }) {
  return (
    <div className="projects">
      {items.map((item) => (
        <article className="project" key={item.name}>
          <div className="project-header">
            <span className="project-name">{item.name}</span>
            <span className="project-tag">{item.tag}</span>
          </div>
          <p className="project-desc">{item.description}</p>
        </article>
      ))}
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    const root = document.documentElement;
    const storageKey = "tucker-website-next-content-v2";
    const legacyStorageKeys = [
      "tucker-website-next-content-v1",
      "tucker-website-content-v2",
      "tucker-website-content-v1",
    ];
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const editableContent = document.getElementById("editable-content");
    const toggleEditButton = document.getElementById("toggle-edit");
    const saveButton = document.getElementById("save-edit");
    const resetButton = document.getElementById("reset-edit");
    const statusEl = document.getElementById("edit-status");

    if (!editableContent || !toggleEditButton || !saveButton || !resetButton || !statusEl) {
      return;
    }

    const defaultContent = editableContent.innerHTML;
    const getNormalizedText = (value) => value.replace(/\s+/g, " ").trim().toLowerCase();
    const migrateSavedContent = (rawHtml) => {
      const contactUpdatedHtml = rawHtml
        .replace(/mailto:tuckerclark91@gmail\.com/g, "mailto:tucker@agentmail.to")
        .replace(/tuckerclark91@gmail\.com/g, "tucker@agentmail.to");

      const workingWrapper = document.createElement("div");
      workingWrapper.innerHTML = contactUpdatedHtml;

      const hasWorkingOnSection =
        workingWrapper.querySelector('[data-section="working-on"]') ||
        getNormalizedText(workingWrapper.textContent || "").includes("what i'm working on") ||
        getNormalizedText(workingWrapper.textContent || "").includes("what i’m working on");

      if (hasWorkingOnSection) {
        return contactUpdatedHtml;
      }

      const templateWrapper = document.createElement("div");
      templateWrapper.innerHTML = defaultContent;
      const workingOnSection = templateWrapper.querySelector('[data-section="working-on"]');
      if (!workingOnSection) {
        return contactUpdatedHtml;
      }

      const experienceSection = workingWrapper.querySelector('[data-section="experience"]');
      if (experienceSection) {
        workingWrapper.insertBefore(workingOnSection.cloneNode(true), experienceSection);
      } else {
        const footer = workingWrapper.querySelector("footer");
        if (footer) {
          workingWrapper.insertBefore(workingOnSection.cloneNode(true), footer);
        } else {
          workingWrapper.appendChild(workingOnSection.cloneNode(true));
        }
      }

      return workingWrapper.innerHTML;
    };

    const savedContent = localStorage.getItem(storageKey);
    if (savedContent) {
      const migratedSavedContent = migrateSavedContent(savedContent);
      editableContent.innerHTML = migratedSavedContent;
      if (migratedSavedContent !== savedContent) {
        localStorage.setItem(storageKey, migratedSavedContent);
      }
    } else {
      const legacySavedContent = legacyStorageKeys.map((key) => localStorage.getItem(key)).find(Boolean);
      if (legacySavedContent) {
        const migratedLegacyContent = migrateSavedContent(legacySavedContent);
        editableContent.innerHTML = migratedLegacyContent;
        localStorage.setItem(storageKey, migratedLegacyContent);
      }
    }

    let isEditing = false;
    let isDirty = false;

    const updateStatus = (message) => {
      statusEl.textContent = message;
    };

    const setDirtyState = (dirty) => {
      isDirty = dirty;
      saveButton.disabled = !dirty;
      if (isEditing) {
        updateStatus(dirty ? "Editing (unsaved)" : "Editing");
      }
    };

    const setEditMode = (enabled) => {
      isEditing = enabled;
      editableContent.setAttribute("contenteditable", enabled ? "true" : "false");
      editableContent.setAttribute("spellcheck", enabled ? "true" : "false");
      document.body.classList.toggle("edit-enabled", enabled);
      toggleEditButton.textContent = enabled ? "Exit Edit Mode" : "Enable Edit Mode";
      updateStatus(enabled ? (isDirty ? "Editing (unsaved)" : "Editing") : "Viewing mode");
    };

    const saveChanges = () => {
      localStorage.setItem(storageKey, editableContent.innerHTML);
      legacyStorageKeys.forEach((legacyKey) => localStorage.removeItem(legacyKey));
      setDirtyState(false);
      updateStatus("Saved");
    };

    const onToggleEdit = () => {
      setEditMode(!isEditing);
    };

    const onSave = () => {
      saveChanges();
    };

    const onReset = () => {
      const confirmed = window.confirm("Reset all edits and restore original content?");
      if (!confirmed) {
        return;
      }
      localStorage.removeItem(storageKey);
      legacyStorageKeys.forEach((legacyKey) => localStorage.removeItem(legacyKey));
      editableContent.innerHTML = defaultContent;
      setDirtyState(false);
      setEditMode(false);
      updateStatus("Reset complete");
    };

    const onEditableInput = () => {
      if (isEditing) {
        setDirtyState(true);
      }
    };

    const onEditableClick = (event) => {
      if (isEditing && event.target.closest("a")) {
        event.preventDefault();
      }
    };

    const onKeyDown = (event) => {
      const isSaveShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s";
      if (isSaveShortcut && isEditing) {
        event.preventDefault();
        saveChanges();
      }
    };

    const updateCityParallax = () => {
      if (reducedMotionQuery.matches) {
        root.style.setProperty("--scroll-far", "0px");
        root.style.setProperty("--scroll-mid", "0px");
        root.style.setProperty("--scroll-near", "0px");
        return;
      }

      const yOffset = window.scrollY || window.pageYOffset || 0;
      root.style.setProperty("--scroll-far", `${(yOffset * -0.08).toFixed(2)}px`);
      root.style.setProperty("--scroll-mid", `${(yOffset * -0.18).toFixed(2)}px`);
      root.style.setProperty("--scroll-near", `${(yOffset * -0.3).toFixed(2)}px`);
    };

    toggleEditButton.addEventListener("click", onToggleEdit);
    saveButton.addEventListener("click", onSave);
    resetButton.addEventListener("click", onReset);
    editableContent.addEventListener("input", onEditableInput);
    editableContent.addEventListener("click", onEditableClick);
    document.addEventListener("keydown", onKeyDown);

    updateCityParallax();
    window.addEventListener("scroll", updateCityParallax, { passive: true });

    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", updateCityParallax);
    } else if (typeof reducedMotionQuery.addListener === "function") {
      reducedMotionQuery.addListener(updateCityParallax);
    }

    return () => {
      document.body.classList.remove("edit-enabled");
      toggleEditButton.removeEventListener("click", onToggleEdit);
      saveButton.removeEventListener("click", onSave);
      resetButton.removeEventListener("click", onReset);
      editableContent.removeEventListener("input", onEditableInput);
      editableContent.removeEventListener("click", onEditableClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", updateCityParallax);
      if (typeof reducedMotionQuery.removeEventListener === "function") {
        reducedMotionQuery.removeEventListener("change", updateCityParallax);
      } else if (typeof reducedMotionQuery.removeListener === "function") {
        reducedMotionQuery.removeListener(updateCityParallax);
      }
    };
  }, []);

  return (
    <>
      <div className="city-backdrop" aria-hidden="true">
        <div className="city-moon"></div>
        <div className="city-glow"></div>
        <div className="city-clouds city-clouds-back"></div>
        <div className="city-clouds city-clouds-front"></div>
        <div className="city-haze"></div>
        <div className="city-layer layer-far"></div>
        <div className="city-layer layer-mid"></div>
        <div className="city-layer layer-near"></div>
        <div className="city-road-lights"></div>
      </div>
      <div className="noise"></div>

      <div className="edit-toolbar">
        <button id="toggle-edit" type="button">
          Enable Edit Mode
        </button>
        <button id="save-edit" type="button" disabled>
          Save
        </button>
        <button id="reset-edit" type="button">
          Reset
        </button>
        <span className="edit-status" id="edit-status">
          Viewing mode
        </span>
      </div>

      <div className="page-layout">
        <main className="container" id="editable-content" contentEditable={false} spellCheck={false}>
          <div className="terminal-bar">
            <div className="terminal-dot dot-red"></div>
            <div className="terminal-dot dot-yellow"></div>
            <div className="terminal-dot dot-green"></div>
            <span className="terminal-title">tucker@dev ~ </span>
          </div>
          <div className="terminal-body">
            <div className="prompt">
              <span className="path">~/tucker</span> <span className="arrow">&gt;</span> whoami
            </div>
            <h1>
              <span className="accent">Tucker Clark</span>
            </h1>
            <p className="tagline">senior red team operator · security engineer</p>
            <p className="bio">
              Senior Red Team Operator and Security Engineer with 5+ years of experience in red team operations and
              penetration testing across networks, cloud, and web applications. 2+ years leading consulting projects and
              technical teams with a background in AI, data science, and software engineering.
              <span className="cursor"></span>
            </p>
            <div className="links">
              <a href="mailto:tucker@agentmail.to">tucker@agentmail.to</a>
              <a href="tel:+14232908213">+1 (423) 290-8213</a>
            </div>
          </div>

          <section data-section="working-on">
            <div className="section-label">What I&apos;m Working On</div>
            <div className="working-on-grid">
              {whatImWorkingOn.map((item) => (
                <article className="working-on-card" key={item.title}>
                  <div className="working-on-header">
                    <span className="working-on-title">{item.title}</span>
                    <span className="working-on-status">{item.status}</span>
                  </div>
                  <p className="working-on-desc">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section data-section="experience">
            <div className="section-label">Experience</div>
            <Projects items={experience} />
          </section>

          <section data-section="independent-projects">
            <div className="section-label">Independent Projects</div>
            <Projects items={independentProjects} />
          </section>

          <section data-section="skills">
            <div className="section-label">Skills &amp; Certifications</div>
            <div className="skills">
              {skills.map((skill) => (
                <span className="skill" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section data-section="education">
            <div className="section-label">Education</div>
            <p className="edu-note">
              B.S. in Computer Science (Data Science), University of Tennessee at Chattanooga (May 2020). Teaching
              Assistant for Intro to Machine Learning; recipient of NSF S-STEM scholarship and UTC Freshman Mathematics
              Award.
            </p>
          </section>

          <footer>
            <span className="accent">&gt;</span> built by tucker · 2026
          </footer>
        </main>

        <aside className="side-rail" aria-label="Sidebar">
          <div className="side-contact-card">
            <div className="side-contact-title">Contact</div>
            <p className="side-contact-note">Open to security engineering and red team collaboration.</p>
            <div className="side-contact-links">
              <a className="side-contact-link" href="mailto:tucker@agentmail.to">
                tucker@agentmail.to
              </a>
              <a className="side-contact-link" href="tel:+14232908213">
                +1 (423) 290-8213
              </a>
            </div>
          </div>
          <SnakeGame />
        </aside>
      </div>
    </>
  );
}
