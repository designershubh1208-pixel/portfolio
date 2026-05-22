import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const HERO_PORTRAIT_SRC = `${import.meta.env.BASE_URL}image.png`;

const NAV_ITEMS = [
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

const PROJECTS = [
  {
    num: "01",
    title: "User Panel Dashboard",
    category: "Full Stack",
    description:
      "A modular admin interface for user management and analytics — designed as a calm control surface with performance-first UI patterns.",
    tags: ["React", "UI Systems", "Analytics"],
    link: "https://github.com/shubhsanket/user-panel-dashboard",
  },
  {
    num: "02",
    title: "ProvenDev",
    category: "Blockchain",
    description:
      "On-chain verification for developer reputation — a trust layer that turns credentials into portable, auditable proof.",
    tags: ["Solidity", "EVM", "Next.js"],
    link: "https://github.com/shubhsanket/ProvenDev",
  },
  {
    num: "03",
    title: "On-Block",
    category: "Infrastructure",
    description:
      "Decentralized publishing on Polygon with IPFS storage — built for ownership, permanence, and resilient distribution.",
    tags: ["Polygon", "IPFS", "Protocols"],
    link: "https://github.com/shubhsanket/on-block",
  },
];

const TECH_STACK = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "PyTorch",
  "Solidity",
  "EVM",
  "Docker",
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

function pad2(n) {
  return String(n).padStart(2, "0");
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Portfolio({ heroRef }) {
  const fallbackHeroRef = useRef(null);
  const resolvedHeroRef = heroRef ?? fallbackHeroRef;

  const portraitRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("hero");

  const chapters = useMemo(() => [{ id: "hero", label: "Index" }, ...NAV_ITEMS], []);
  const activeChapterIndex = Math.max(
    0,
    chapters.findIndex((c) => c.id === activeSectionId)
  );

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
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));
    if (elements.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -12% 0px" }
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[data-section]"));
    if (sections.length === 0) return;

    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible.length > 0) setActiveSectionId(visible[0].target.id);
      },
      { threshold: [0.25, 0.4, 0.6], rootMargin: "-10% 0px -55% 0px" }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = portraitRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const t = Math.min(42, y * 0.06);
        el.style.transform = `translateY(${t}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const onProjectMouseMove = useCallback((e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty("--mx", `${mx.toFixed(2)}%`);
    card.style.setProperty("--my", `${my.toFixed(2)}%`);
  }, []);

  return (
    <div className="site">
      <div className="chapter-indicator" aria-hidden>
        CH. {pad2(activeChapterIndex)} / {pad2(chapters.length - 1)}
      </div>

      <header className="site-header">
        <button
          type="button"
          className="menu-button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="menu-icon" aria-hidden>
            <span />
            <span />
          </span>
          <span className="menu-text">Menu</span>
        </button>

        <div className="site-mast" aria-hidden>
          <span>Portfolio</span>
          <span className="mast-divider" />
          <span>2026</span>
        </div>
      </header>

      <div
        id="site-menu"
        className={menuOpen ? "menu-overlay is-open" : "menu-overlay"}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      >
        <div className="menu-panel" onClick={(e) => e.stopPropagation()}>
          <div className="menu-eyebrow">Navigation</div>
          <ul className="menu-list">
            {chapters.map((item, idx) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="menu-link"
                  onClick={() => {
                    setMenuOpen(false);
                    scrollToId(item.id);
                  }}
                >
                  <span className="menu-num">{pad2(idx)}</span>
                  <span className="menu-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="menu-foot">
            <div className="menu-foot-label">Links</div>
            <div className="menu-foot-links">
              <a href="https://github.com/shubhsanket" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  scrollToId("contact");
                }}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      <main>
        <section id="hero" className="hero" data-section>
          <div className="hero-vertical" aria-hidden>
            ENGINEER / SYSTEMS / INTELLIGENCE
          </div>

          <div className="hero-left">
            <div className="hero-meta" data-reveal>
              <div ref={resolvedHeroRef} className="hero-name">
                SHUBH SANKET
              </div>
              <span className="meta-divider" aria-hidden />
              <div className="hero-role">SYSTEMS / PRODUCT</div>
            </div>

            <div className="hero-type" data-reveal>
              <div className="hero-word hero-word-xl">FULL</div>
              <div className="hero-word hero-word-xl hero-word-shift">STACK</div>
              <div className="hero-word hero-word-md hero-word-offset">AI / ML</div>
              <div className="hero-word hero-word-lg hero-word-offset2">BLOCKCHAIN</div>
              <div className="hero-word hero-word-md hero-word-offset3">SEO SYSTEMS</div>
            </div>

            <p className="hero-subtitle" data-reveal>
              I design and ship production-grade software: full stack applications, AI/ML systems,
              and protocol-level infrastructure — with an editorial approach to clarity,
              performance, and long-term maintainability.
            </p>

            <div className="hero-actions" data-reveal>
              <a
                className="btn btn-primary"
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("projects");
                }}
              >
                Selected Work
              </a>
              <a
                className="btn btn-ghost"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("contact");
                }}
              >
                Contact
              </a>
            </div>

            <div className="hero-annotations" data-reveal>
              <div className="anno">
                <div className="anno-k">Edition</div>
                <div className="anno-v">01</div>
              </div>
              <div className="anno">
                <div className="anno-k">Focus</div>
                <div className="anno-v">Systems</div>
              </div>
              <div className="anno">
                <div className="anno-k">Mode</div>
                <div className="anno-v">Build</div>
              </div>
            </div>
          </div>

          <div className="hero-right" aria-label="Portrait">
            <div className="hero-plate" aria-hidden />
            <figure className="hero-portrait">
              <img
                ref={portraitRef}
                className="hero-photo"
                src={HERO_PORTRAIT_SRC}
                alt="Portrait"
                loading="eager"
              />
            </figure>
            <div className="hero-caption" data-reveal>
              <div className="caption-k">Caption</div>
              <div className="caption-v">Calm interfaces. Serious engineering.</div>
            </div>
          </div>

          <div className="hero-float hero-float-a" aria-hidden />
          <div className="hero-float hero-float-b" aria-hidden />
        </section>

        <section id="full-stack" className="chapter" data-section>
          <div className="chapter-inner">
            <div className="chapter-head" data-reveal>
              <div className="eyebrow">01 — Discipline</div>
              <h2>Full Stack Engineering</h2>
            </div>
            <div className="chapter-body" data-reveal>
              <p className="chapter-desc">
                Architectural calm: clean boundaries, measurable performance, and maintainable
                systems that scale without sacrificing ergonomics.
              </p>
              <ul className="skill-list">
                <li>Component systems & design primitives</li>
                <li>APIs, data modeling, and service contracts</li>
                <li>Performance budgets & observability</li>
                <li>Production-grade DX and tooling</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="ai-ml" className="chapter" data-section>
          <div className="chapter-inner">
            <div className="chapter-head" data-reveal>
              <div className="eyebrow">02 — Discipline</div>
              <h2>AI/ML Systems</h2>
            </div>
            <div className="chapter-body" data-reveal>
              <p className="chapter-desc">
                From prototype to production: evaluation-first pipelines, safety-minded UX, and
                deployment patterns that respect latency, cost, and reliability.
              </p>
              <ul className="skill-list">
                <li>RAG, retrieval strategy, and data quality</li>
                <li>Model serving, caching, and latency control</li>
                <li>Human-in-the-loop workflows & guardrails</li>
                <li>Instrumentation & continuous evaluation</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="blockchain" className="chapter" data-section>
          <div className="chapter-inner">
            <div className="chapter-head" data-reveal>
              <div className="eyebrow">03 — Discipline</div>
              <h2>Blockchain Infrastructure</h2>
            </div>
            <div className="chapter-body" data-reveal>
              <p className="chapter-desc">
                Protocol-aware engineering: clarity around trust surfaces, deterministic behavior,
                and composable architecture designed for long-lived systems.
              </p>
              <ul className="skill-list">
                <li>Smart contracts & on-chain verification</li>
                <li>Indexing, events, and off-chain services</li>
                <li>Security mindset & failure-mode design</li>
                <li>Developer UX for Web3 products</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="seo" className="chapter" data-section>
          <div className="chapter-inner">
            <div className="chapter-head" data-reveal>
              <div className="eyebrow">04 — Discipline</div>
              <h2>SEO & Growth Intelligence</h2>
            </div>
            <div className="chapter-body" data-reveal>
              <p className="chapter-desc">
                Growth as engineering: technical SEO, performance, and instrumentation as a
                compounding system — not a checklist.
              </p>
              <ul className="skill-list">
                <li>Core Web Vitals & rendering strategy</li>
                <li>Programmatic SEO systems</li>
                <li>Analytics integrity & event design</li>
                <li>Content architecture for discovery</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="projects" className="projects" data-section>
          <div className="section-head" data-reveal>
            <div className="eyebrow">05 — Gallery</div>
            <h2>Selected Projects</h2>
            <p className="section-desc">
              Editorial project panels — sparse text, quiet hierarchy, and a focus on systems.
            </p>
          </div>

          <div className="projects-list">
            {PROJECTS.map((p) => (
              <article
                key={p.num}
                className="project"
                data-reveal
                onMouseMove={onProjectMouseMove}
              >
                <div className="project-visual" aria-hidden>
                  <div className="project-num">{p.num}</div>
                  <div className="project-visual-grid" />
                </div>
                <div className="project-body">
                  <div className="project-meta">{p.category}</div>
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{p.description}</p>
                  <div className="project-tags" aria-label="Project tags">
                    {p.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  <a className="project-link" href={p.link} target="_blank" rel="noreferrer">
                    View Repository
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="research" className="lists" data-section>
          <div className="section-head" data-reveal>
            <div className="eyebrow">06 — Studio</div>
            <h2>Research & Experiments</h2>
            <p className="section-desc">Ongoing explorations — built as systems, written as notes.</p>
          </div>

          <div className="list-grid">
            {RESEARCH_ITEMS.map((item) => (
              <div key={item.code} className="list-item" data-reveal>
                <div className="list-code">{item.code}</div>
                <div className="list-main">
                  <div className="list-title">{item.title}</div>
                  <div className="list-meta">{item.meta}</div>
                  <div className="list-desc">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="tech-stack" className="stack" data-section>
          <div className="section-head" data-reveal>
            <div className="eyebrow">07 — Inventory</div>
            <h2>Tech Stack</h2>
            <p className="section-desc">A restrained set of tools — chosen for leverage.</p>
          </div>

          <div className="stack-grid" data-reveal>
            {TECH_STACK.map((t) => (
              <div key={t} className="stack-chip">
                {t}
              </div>
            ))}
          </div>
        </section>

        <section id="case-studies" className="lists" data-section>
          <div className="section-head" data-reveal>
            <div className="eyebrow">08 — Field Notes</div>
            <h2>Case Studies</h2>
            <p className="section-desc">Available on request — structured, measurable, and calm.</p>
          </div>

          <div className="list-grid">
            {CASE_STUDIES.map((item) => (
              <div key={item.code} className="list-item" data-reveal>
                <div className="list-code">{item.code}</div>
                <div className="list-main">
                  <div className="list-title">{item.title}</div>
                  <div className="list-meta">{item.meta}</div>
                  <div className="list-desc">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact" data-section>
          <div className="contact-inner">
            <div className="section-head" data-reveal>
              <div className="eyebrow">09 — Contact</div>
              <h2>Contact / Collaboration</h2>
              <p className="section-desc">If you're building something precise — let's collaborate.</p>
            </div>

            <div className="contact-grid" data-reveal>
              <div className="contact-block">
                <div className="contact-k">Email</div>
                <a className="contact-v" href="mailto:hello@shubh.dev">
                  hello@shubh.dev
                </a>
              </div>

              <div className="contact-block">
                <div className="contact-k">Links</div>
                <div className="contact-links">
                  <a href="https://github.com/shubhsanket" target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                  <a href="https://linkedin.com/in/shubh-sanket" target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                  <a href="https://twitter.com/shubh_sanket" target="_blank" rel="noreferrer">
                    X
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-foot" data-reveal>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  window.location.href = "mailto:hello@shubh.dev";
                }}
              >
                Start a conversation
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
