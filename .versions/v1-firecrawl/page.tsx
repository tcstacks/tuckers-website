"use client";

import { useEffect } from "react";

const work = [
  { year: "2026", title: "Lumen", tag: "Product" },
  { year: "2025", title: "Tideline", tag: "Identity" },
  { year: "2024", title: "Driftwood", tag: "Interface" },
];

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll(".fade").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav className="nav">
        <a href="#" className="logo">
          <span className="logoDot" />
          yourname
        </a>
        <div className="navLinks">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <a href="mailto:hello@example.com" className="navCta">
          Say hello
        </a>
      </nav>

      <main>
        <section className="hero">
          <div className="glow" aria-hidden="true" />
          <p className="kicker fade">Designer & builder · 2026</p>
          <h1 className="fade">
            Quiet products,<br />
            <span className="accent">warm details.</span>
          </h1>
          <p className="lede fade">
            Building focused, durable interfaces from a house by the sea.
          </p>
          <div className="ctas fade">
            <a href="#work" className="btn primary">See work</a>
            <a href="mailto:hello@example.com" className="btn">Get in touch →</a>
          </div>
        </section>

        <section id="work" className="section">
          <p className="label fade">Selected work</p>
          <ul className="list">
            {work.map((w) => (
              <li key={w.title} className="row fade">
                <span className="rowYear">{w.year}</span>
                <span className="rowTitle">{w.title}</span>
                <span className="rowTag">{w.tag}</span>
                <span className="rowArrow">→</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="about" className="section">
          <p className="label fade">About</p>
          <p className="prose fade">
            I shape products, brands, and small worlds. Previously in studios,
            now independent. Always drawn to the coast.
          </p>
        </section>

        <section id="contact" className="section contact">
          <p className="label fade">Contact</p>
          <a href="mailto:hello@example.com" className="email fade">
            hello@example.com
          </a>
        </section>

        <footer className="footer">
          <span>© 2026 Your Name</span>
          <div className="footerLinks">
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
          </div>
        </footer>
      </main>
    </>
  );
}
