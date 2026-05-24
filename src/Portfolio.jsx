import { useEffect, useMemo, useRef, useState } from "react";
import { usePortfolioContent } from "./hooks/usePortfolioContent";
import { useScrollAnimations } from "./hooks/useScrollAnimations";
import { sendContactMessage } from "./lib/contactMessage";

const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, select, label, [role='button'], [role='link']";

function useNoirCursor(enabled) {
  const rootRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return undefined;

    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring) return undefined;

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let visible = false;
    let raf = 0;

    const setVisible = (on) => {
      if (visible === on) return;
      visible = on;
      root.classList.toggle("is-visible", on);
      document.documentElement.classList.toggle("noir-cursor-on", on);
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      setVisible(true);
      const el = document.elementFromPoint(mx, my);
      document.documentElement.classList.toggle(
        "noir-cursor-hover",
        Boolean(el instanceof Element && el.closest(INTERACTIVE_SELECTOR))
      );
    };

    const onLeave = () => {
      setVisible(false);
      document.documentElement.classList.remove("noir-cursor-hover");
    };

    const onDown = () => {
      document.documentElement.classList.add("noir-cursor-press");
    };

    const onUp = () => {
      document.documentElement.classList.remove("noir-cursor-press");
    };

    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove(
        "noir-cursor-on",
        "noir-cursor-hover",
        "noir-cursor-press"
      );
      setVisible(false);
    };
  }, [enabled]);

  return { rootRef, dotRef, ringRef };
}

const PORTRAIT_SRC = `${import.meta.env.BASE_URL}image.png`;

const NAV_ITEMS = [
  { id: "about", label: "About Me" },
  { id: "full-stack", label: "Full Stack Engineering" },
  { id: "ai-ml", label: "AI/ML Systems" },
  { id: "blockchain", label: "Blockchain Infrastructure" },
  { id: "seo", label: "SEO & Growth Intelligence" },
  { id: "projects", label: "Selected Projects" },
  { id: "research", label: "Research & Experiments" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "case-studies", label: "Case Studies" },
  { id: "contact", label: "Contact / Collaboration" },
];

const DISCIPLINES = [
  {
    id: "full-stack",
    eyebrow: "02 — Discipline",
    title: "Full Stack Engineering",
    description:
      "Architectural calm: clean boundaries, measurable performance, and maintainable systems that scale without sacrificing ergonomics.",
    bullets: [
      "Component systems & design primitives",
      "APIs, data modeling, and service contracts",
      "Performance budgets & observability",
      "Production-grade DX and tooling",
    ],
  },
  {
    id: "ai-ml",
    eyebrow: "03 — Discipline",
    title: "AI/ML Systems",
    description:
      "From prototype to production: evaluation-first pipelines, safety-minded UX, and deployment patterns that respect latency, cost, and reliability.",
    bullets: [
      "RAG, retrieval strategy, and data quality",
      "Model serving, caching, and latency control",
      "Human-in-the-loop workflows & guardrails",
      "Instrumentation & continuous evaluation",
    ],
  },
  {
    id: "blockchain",
    eyebrow: "04 — Discipline",
    title: "Blockchain Infrastructure",
    description:
      "Protocol-aware engineering: clarity around trust surfaces, deterministic behavior, and composable architecture designed for long-lived systems.",
    bullets: [
      "Smart contracts & on-chain verification",
      "Indexing, events, and off-chain services",
      "Security mindset & failure-mode design",
      "Developer UX for Web3 products",
    ],
  },
  {
    id: "seo",
    eyebrow: "05 — Discipline",
    title: "SEO & Growth Intelligence",
    description:
      "Growth as engineering: technical SEO, performance, and instrumentation as a compounding system — not a checklist.",
    bullets: [
      "Core Web Vitals & rendering strategy",
      "Programmatic SEO systems",
      "Analytics integrity & event design",
      "Content architecture for discovery",
    ],
  },
];

const PROJECTS = [
  {
    num: "01",
    title: "IntrusionX",
    category: "Security · Graph AI",
    description:
      "Dominoes in the Dark — predicting cascading attack paths using TigerGraph and graph intelligence for intrusion analysis.",
    tags: ["TigerGraph", "TypeScript", "Security"],
    link: "https://github.com/designershubh1208-pixel/IntrusionX",
  },
  {
    num: "02",
    title: "SentinelChain",
    category: "Blockchain · AI",
    description:
      "AI smart contract analysis in real time — before and after exploit scenarios to surface risk with clarity.",
    tags: ["Solidity", "TypeScript", "AI"],
    link: "https://github.com/designershubh1208-pixel/Sentinel-chain",
  },
  {
    num: "03",
    title: "OnBlock",
    category: "Web3 · Payments",
    description:
      "Invisible rail for payments and transactions in two clicks — lightweight on-chain commerce flows.",
    tags: ["TypeScript", "Web3", "Payments"],
    link: "https://github.com/designershubh1208-pixel/on-block",
  },
  {
    num: "04",
    title: "DeFAI",
    category: "AI Agents · Governance",
    description:
      "Governance-first autonomous AI agent that automates digital transactions using Gemini, smart-wallet policies, and simulated commerce.",
    tags: ["Gemini AI", "Smart Wallet", "Agents"],
    link: "https://github.com/designershubh1208-pixel/DeFAI",
  },
  {
    num: "05",
    title: "Marvel",
    category: "Frontend · Creative",
    description:
      "Marvel Cinematic Universe experience — cinematic UI built as an expressive front-end exploration.",
    tags: ["React", "UI", "Creative"],
    link: "https://github.com/designershubh1208-pixel/marvel",
  },
];

const TECH_STACK = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Firebase",
  "PyTorch",
  "TensorFlow",
  "Solidity",
  "EVM",
  "Docker",
  "n8n",
  "WordPress",
  "Webflow",
  "Framer",
  "Figma",
];

const RESEARCH_ITEMS = [
  {
    code: "R/01",
    title: "SEARCH INTEL‑LIGENCE",
    meta: "Systems notes",
    description:
      "Information architecture, retrieval strategy, and evaluation loops designed for calm, measurable product outcomes.",
  },
  {
    code: "R/02",
    title: "EDGE INFER‑ENCE",
    meta: "Experiments",
    description:
      "Latency budgets, quantization tradeoffs, and pragmatic deployment patterns for modern model serving.",
  },
  {
    code: "R/03",
    title: "DECENTRA‑LIZED SYSTEMS",
    meta: "Protocol sketches",
    description:
      "Composability, trust surfaces, and failure modes — mapping reliability as a first-class design constraint.",
  },
];

const CASE_STUDIES = [
  {
    code: "CS/01",
    title: "SEO & GROWTH INTELLIGENCE",
    meta: "Audit → system",
    description:
      "Turning technical SEO into an engineering discipline: instrumentation, performance, and compounding discovery.",
  },
  {
    code: "CS/02",
    title: "AI SYSTEMS IN PRODUCT",
    meta: "Prototype → production",
    description:
      "A delivery playbook for shipping AI features: human loops, guardrails, evaluation, and operational clarity.",
  },
];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function toGithubSlug(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return null;
    const [owner, repo] = parsed.pathname.split("/").filter(Boolean);
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch {
    return null;
  }
}

function formatUpdatedDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  } catch {
    return "";
  }
}

function ProjectCard({ project, repoMeta, reposReady }) {
  const slug = toGithubSlug(project.link);
  const key = slug ? `${slug.owner}/${slug.repo}` : "";
  const meta = key ? repoMeta[key] : undefined;
  const repoLoaded = key ? Boolean(reposReady[key]) : true;
  const homepage = typeof meta?.homepage === "string" ? meta.homepage.trim() : "";
  const showHomepage = Boolean(homepage);

  return (
    <article className="noir-project">
      <div className="noir-project-num" aria-hidden="true">
        {project.num}
      </div>
      <div className="noir-project-body">
        <div className="noir-project-meta">{project.category}</div>
        <h3 className="noir-h3">{project.title}</h3>
        <p className="noir-p noir-project-desc">{project.description}</p>

        <div className="noir-tags" aria-label="Project tags">
          {project.tags.map((t) => (
            <span key={t} className="noir-tag">
              {t}
            </span>
          ))}
        </div>

        {!repoLoaded ? (
          <div className="noir-project-stats" aria-label="Repository stats">
            <span className="noir-muted">Fetching GitHub…</span>
          </div>
        ) : meta ? (
          <div className="noir-project-stats" aria-label="Repository stats">
            <span>★ {meta.stargazers_count ?? 0}</span>
            {meta.language ? <span>{meta.language}</span> : null}
            {meta.updated_at ? (
              <span>Updated {formatUpdatedDate(meta.updated_at)}</span>
            ) : null}
          </div>
        ) : null}

        <div className="noir-project-links">
          <a href={project.link} target="_blank" rel="noreferrer">
            GitHub
          </a>
          {showHomepage ? (
            <a href={homepage} target="_blank" rel="noreferrer">
              Live
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const pageRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [repoMeta, setRepoMeta] = useState({});
  const [reposReady, setReposReady] = useState({});
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState({ type: "", message: "" });
  const [contactSending, setContactSending] = useState(false);
  const { about } = usePortfolioContent();
  const { rootRef: cursorRootRef, dotRef: cursorDotRef, ringRef: cursorRingRef } =
    useNoirCursor(!menuOpen);

  useScrollAnimations(pageRef);

  const chapters = useMemo(
    () => [{ id: "hero", label: "Home" }, ...NAV_ITEMS],
    []
  );

  const marqueeProjects = useMemo(() => [...PROJECTS, ...PROJECTS], []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const slugs = PROJECTS.map((p) => toGithubSlug(p.link)).filter(Boolean);
      if (slugs.length === 0) return;

      await Promise.all(
        slugs.map(async ({ owner, repo }) => {
          const key = `${owner}/${repo}`;
          try {
            const res = await fetch(`/api/github/${owner}/${repo}`, {
              signal: controller.signal,
            });
            if (!res.ok) return;
            const data = await res.json();
            if (data?.repo) {
              setRepoMeta((prev) => ({ ...prev, [key]: data.repo }));
            }
          } finally {
            setReposReady((prev) => ({ ...prev, [key]: true }));
          }
        })
      );
    }

    load().catch(() => {});
    return () => controller.abort();
  }, []);

  async function handleContactSubmit(e) {
    e.preventDefault();
    setContactSending(true);
    setContactStatus({ type: "", message: "" });

    try {
      await sendContactMessage(contactForm);
      setContactStatus({
        type: "success",
        message: "Message sent — I'll get back to you soon.",
      });
      setContactForm({ name: "", email: "", message: "" });
    } catch (err) {
      setContactStatus({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Could not send your message. Check Firebase setup or run npm run dev.",
      });
    } finally {
      setContactSending(false);
    }
  }

  return (
    <div className="noir-page" ref={pageRef}>
      <div ref={cursorRootRef} className="noir-cursor" aria-hidden="true">
        <div ref={cursorRingRef} className="noir-cursor-ring" />
        <div ref={cursorDotRef} className="noir-cursor-dot" />
      </div>

      <button
        type="button"
        className="noir-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="noir-menu"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className="noir-menu-lines" aria-hidden="true" />
      </button>

      <div
        id="noir-menu"
        className={menuOpen ? "noir-overlay is-open" : "noir-overlay"}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      >
        <div className="noir-overlay-panel" onClick={(e) => e.stopPropagation()}>
          <div className="noir-overlay-title">Navigation</div>
          <ul className="noir-overlay-list">
            {chapters.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="noir-overlay-link"
                  onClick={() => {
                    setMenuOpen(false);
                    scrollToId(item.id);
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section id="hero" className="noir-hero" aria-label="Hero">
        <div className="noir-name" aria-hidden="true">
          <span className="noir-name-left">SHUBH</span>
          <span className="noir-name-right">SANKET</span>
        </div>

        <figure className="noir-portrait-frame" aria-label="Portrait">
          <img
            className="noir-portrait"
            src={PORTRAIT_SRC}
            alt="Portrait"
            draggable={false}
            loading="eager"
          />
        </figure>
      </section>

      <section id="about" className="noir-section noir-about" aria-label="About Me">
        <div className="noir-section-inner">
          <div className="noir-about-grid">
            <header className="noir-about-head" data-reveal>
              <div className="noir-eyebrow">{about.eyebrow}</div>
              <h2 className="noir-h2">{about.title}</h2>
              <p className="noir-about-lead">{about.lead}</p>
            </header>

            <div className="noir-about-body" data-reveal-stagger>
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="noir-p" data-reveal-child>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="noir-about-highlights" data-reveal-stagger>
            {about.highlights.map((item) => (
              <div key={item.label} className="noir-about-highlight" data-reveal-child>
                <div className="noir-about-highlight-k">{item.label}</div>
                <div className="noir-about-highlight-v">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {DISCIPLINES.map((d) => (
        <section
          key={d.id}
          id={d.id}
          className="noir-section noir-section-split"
          aria-label={d.title}
          data-reveal
        >
          <div className="noir-section-inner">
            <div className="noir-section-head">
              <div className="noir-eyebrow">{d.eyebrow}</div>
              <h2 className="noir-h2">{d.title}</h2>
            </div>
            <div className="noir-section-body">
              <p className="noir-p">{d.description}</p>
              <ul className="noir-bullets">
                {d.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section id="projects" className="noir-section" aria-label="Selected Projects" data-reveal>
        <div className="noir-section-inner">
          <div className="noir-section-head">
            <div className="noir-eyebrow">06 — Gallery</div>
            <h2 className="noir-h2">Selected Projects</h2>
            <p className="noir-p noir-p-wide">
              Editorial project panels — sparse text, quiet hierarchy, and a focus on systems.
            </p>
          </div>

          <div className="noir-project-marquee" aria-label="Project showcase carousel">
            <div className="noir-project-track">
              {marqueeProjects.map((p, index) => (
                <ProjectCard
                  key={`${p.num}-${index}`}
                  project={p}
                  repoMeta={repoMeta}
                  reposReady={reposReady}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="research" className="noir-section" aria-label="Research & Experiments" data-reveal>
        <div className="noir-section-inner">
          <div className="noir-section-head">
            <div className="noir-eyebrow">07 — Studio</div>
            <h2 className="noir-h2">Research & Experiments</h2>
            <p className="noir-p noir-p-wide">
              Ongoing explorations — built as systems, written as notes.
            </p>
          </div>

          <div className="noir-card-grid">
            {RESEARCH_ITEMS.map((item) => (
              <div key={item.code} className="noir-card" data-reveal>
                <div className="noir-card-code">{item.code}</div>
                <div className="noir-card-main">
                  <div className="noir-card-title">{item.title}</div>
                  <div className="noir-card-meta">{item.meta}</div>
                  <div className="noir-card-desc">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tech-stack" className="noir-section" aria-label="Tech Stack" data-reveal>
        <div className="noir-section-inner">
          <div className="noir-section-head">
            <div className="noir-eyebrow">08 — Inventory</div>
            <h2 className="noir-h2">Tech Stack</h2>
            <p className="noir-p noir-p-wide">A restrained set of tools — chosen for leverage.</p>
          </div>

          <div className="noir-chip-grid" aria-label="Tech stack list" data-reveal-stagger>
            {TECH_STACK.map((t) => (
              <div key={t} className="noir-chip" data-reveal-child>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="case-studies" className="noir-section" aria-label="Case Studies" data-reveal>
        <div className="noir-section-inner">
          <div className="noir-section-head">
            <div className="noir-eyebrow">09 — Field Notes</div>
            <h2 className="noir-h2">Case Studies</h2>
            <p className="noir-p noir-p-wide">
              Available on request — structured, measurable, and calm.
            </p>
          </div>

          <div className="noir-card-grid">
            {CASE_STUDIES.map((item) => (
              <div key={item.code} className="noir-card" data-reveal>
                <div className="noir-card-code">{item.code}</div>
                <div className="noir-card-main">
                  <div className="noir-card-title">{item.title}</div>
                  <div className="noir-card-meta">{item.meta}</div>
                  <div className="noir-card-desc">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="noir-section" aria-label="Contact / Collaboration" data-reveal>
        <div className="noir-section-inner">
          <div className="noir-section-head">
            <div className="noir-eyebrow">10 — Contact</div>
            <h2 className="noir-h2">Contact / Collaboration</h2>
            <p className="noir-p noir-p-wide">
              If you're building something precise — let's collaborate.
            </p>
          </div>

          <div className="noir-contact-grid">
            <div className="noir-contact-card">
              <div className="noir-contact-k">Email</div>
              <a
                className="noir-contact-v"
                href="mailto:shubhsanket.developer@gmail.com"
              >
                shubhsanket.developer@gmail.com
              </a>
            </div>

            <div className="noir-contact-card">
              <div className="noir-contact-k">Links</div>
              <div className="noir-contact-links">
                <a
                  href="https://github.com/designershubh1208-pixel"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a
                  href="https://www.instagram.com/webtech_shubh/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <form className="noir-contact-form" onSubmit={handleContactSubmit} data-reveal>
            <div className="noir-form-row">
              <label className="noir-form-field">
                <span className="noir-contact-k">Name</span>
                <input
                  className="noir-input"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </label>
              <label className="noir-form-field">
                <span className="noir-contact-k">Email</span>
                <input
                  className="noir-input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </label>
            </div>
            <label className="noir-form-field noir-form-field-full">
              <span className="noir-contact-k">Message</span>
              <textarea
                className="noir-textarea"
                name="message"
                rows={5}
                required
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm((f) => ({ ...f, message: e.target.value }))
                }
              />
            </label>
            <div className="noir-form-actions">
              <button type="submit" className="noir-btn" disabled={contactSending}>
                {contactSending ? "Sending…" : "Send message"}
              </button>
              {contactStatus.message ? (
                <p
                  className={
                    contactStatus.type === "error"
                      ? "noir-form-status noir-form-status-error"
                      : "noir-form-status noir-form-status-success"
                  }
                  role="status"
                >
                  {contactStatus.message}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
