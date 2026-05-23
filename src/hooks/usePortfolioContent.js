import { useEffect, useState } from "react";

export const DEFAULT_ABOUT = {
  eyebrow: "01 — Profile",
  title: "About Me",
  lead: "I build systems that stay clear under load — from interfaces to inference pipelines.",
  paragraphs: [
    "I'm Shubhsanket, a full-stack engineer working across product engineering, AI/ML, blockchain infrastructure, and growth systems. I care about calm UX, strict boundaries between services, and work you can measure — not just ship.",
    "My practice blends design sensibility with production discipline: React and Node ecosystems, retrieval pipelines and model serving, on-chain trust surfaces, and SEO treated as an engineering loop — instrumentation, performance budgets, and compounding discovery.",
    "I'm most useful when the problem is ambiguous but the standard isn't: greenfield platforms, hardening legacy flows, or turning prototypes into reliable systems. Currently open to selective collaborations where ownership, craft, and long-term outcomes matter.",
  ],
  highlights: [
    { label: "Focus", value: "Full Stack · AI/ML · Web3 · SEO" },
    { label: "Philosophy", value: "Clarity, observability, measurable craft" },
    { label: "Status", value: "Open to collaboration" },
  ],
};

const FALLBACK = { about: DEFAULT_ABOUT };

export function usePortfolioContent() {
  const [content, setContent] = useState(FALLBACK);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/content", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data?.about) setContent({ about: data.about });
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return content;
}
