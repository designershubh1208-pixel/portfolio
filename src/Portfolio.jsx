// LoadingBar component for scroll progress
function LoadingBar({ progress }) {
  return (
    <div style={{ width: "100%", height: 4, background: "#23232a", position: "fixed", top: 0, left: 0, zIndex: 2500 }}>
      <div
        style={{
          height: "100%",
          width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
          background: "linear-gradient(90deg, #4f8cff 0%, #a259ff 100%)",
          borderRadius: 2,
          transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </div>
  );
}
import { useState, useEffect, useRef, useCallback } from "react";

// ── DATA ─_
const SKILLS = [
  { name: "React.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Express.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  { name: "Nest.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg" },
  { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  { name: "Supabase", logo: "https://cdn.worldvectorlogo.com/logos/supabase.svg" },
  { name: "TensorFlow", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
  { name: "PyTorch", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "WordPress", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg" },
  { name: "Framer", logo: "https://cdn.worldvectorlogo.com/logos/framer.svg" },
  { name: "Webflow", logo: "https://cdn.worldvectorlogo.com/logos/webflow.svg" },
  { name: "Polygon", logo: "https://cdn.worldvectorlogo.com/logos/polygon-matic.svg" },
  { name: "n8n", logo: "https://avatars.githubusercontent.com/u/45487711?s=200&v=4" },
  { name: "Illustrator", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" },
];

const PROJECTS = [
  { num: "01", title: "User Panel Dashboard", desc: "A sleek, responsive admin dashboard built with React and modular UI components for user management.", problem: "Teams struggled with fragmented user data across platforms", solution: "Built unified dashboard with real-time analytics", impact: "Reduced admin task time by 40% for 200+ daily users", tags: ["React", "Dashboard", "UI/UX"], url: "https://github.com/shubhsanket/user-panel-dashboard" },
  { num: "02", title: "ProvenDev", desc: "Developer reputation and credential platform leveraging on-chain verification for trust.", problem: "Lack of verifiable developer credentials in Web3 hiring", solution: "Created on-chain reputation system with immutable proof", impact: "500+ developers verified, featured in 3 hackathons", tags: ["Web3", "Solidity", "Next.js"], url: "https://github.com/shubhsanket/ProvenDev" },
  { num: "03", title: "On-Block", desc: "Decentralized content publishing system built on Polygon with IPFS storage integration.", problem: "Centralized platforms control creator content ownership", solution: "Built censorship-resistant publishing on Polygon + IPFS", impact: "50+ creators published 200+ articles, zero downtime", tags: ["Polygon", "IPFS", "Blockchain"], url: "https://github.com/shubhsanket/on-block" },
  { num: "04", title: "TinyLlama QLoRA Chat", desc: "Real-time inference engine using fine-tuned TinyLlama with QLoRA quantization for edge deployment.", problem: "LLMs too resource-heavy for edge devices", solution: "Implemented QLoRA quantization for 4-bit inference", impact: "Achieved 3x faster inference on consumer hardware", tags: ["PyTorch", "LLM", "QLoRA"], url: "https://github.com/shubhsanket/tinyllama-qlora-realtime-chat" },
  { num: "05", title: "CLM-DealSign", desc: "Contract lifecycle management system with digital signing, AI clause analysis, and audit trails.", problem: "Manual contract review took days, risked compliance gaps", solution: "Built AI-powered clause extraction + digital workflow", impact: "Cut review time by 60%, processed 1000+ contracts", tags: ["AI", "Node.js", "Contracts"], url: "https://github.com/shubhsanket/CLM-DealSign" },
];

const BLOGS = [
  { tag: "AI Systems", title: "Designing AI Systems for Real Users", excerpt: "Most AI fails not because the model is wrong—but because the system ignored the human. A framework for building AI that people actually use.", date: "Jan 2025", read: "6 min read" },
  { tag: "Architecture", title: "From Web2 to Web3 Architecture", excerpt: "The mental model shift from centralized CRUD apps to decentralized protocol-based systems—and why it matters beyond the hype.", date: "Feb 2025", read: "8 min read" },
  { tag: "Performance", title: "Optimizing React Performance at Scale", excerpt: "Deep dive into memoization strategies, virtualized rendering, bundle splitting, and Suspense patterns that cut load times by 60%.", date: "Mar 2025", read: "10 min read" },
  { tag: "LLMs", title: "Fine-Tuning LLMs with QLoRA in Production", excerpt: "A practitioner's guide to quantized low-rank adaptation—from dataset curation to serving fine-tuned models at the edge.", date: "Apr 2025", read: "12 min read" },
];

const SECTION_LABELS = { hero: "01", about: "02", skills: "03", projects: "04", blog: "05", contact: "06" };
const PHOTO_SRC = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAHuAfkDASIAAhEBAxEB/8QAHQABAAIDAQEBAQAAAAAAAAAAAAYHBAUIAwIBCf/EAEAQAAEDAwIEBAQEBAQEBwEAAAEAAgMEBREGIQcSMUETUWGBInGRoQgUFbEjMkLwM2LB0UNS4fEWJERygpKyU//EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAcEQEBAQADAQEBAAAAAAAAAAAAARECITFBElH/2gAMAwEAAhEDEQA/AOMkREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBFlW6jdW1DYGvDHP2YXdCfJfFZS1FJO6GoidG9pwQQg8EU805RWe76Wks7KfkuAPi/mD3PQD5dvcLAs+g7zVXdlLVwOpafmw+d4wMIuIki3uoLA+3OnMby/wDLyckrHD4mZ6H1B81okQRfpBacEEfNfiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAsm3UNVcKltPSQuke49h0+a8qaGSonbDE0lzjgK2LHQstFriY1xZIWjDeXBk9TsD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";
const FULL_TEXT = "I help startups and dev teams ship production-grade full-stack applications, AI-powered systems, and Web3 protocols—transforming complex technical challenges into scalable solutions that users love.";
const METRICS = [
  { value: "15+", label: "Projects Deployed" },
  { value: "5000+", label: "Lines of Code Written" },
  { value: "3", label: "Hackathon Wins" },
  { value: "500+", label: "GitHub Stars Earned" },
];
const ACHIEVEMENTS = [
  { icon: "🏆", title: "IIT Kharagpur Hackathon Winner", desc: "First place in national-level competition" },
  { icon: "🎓", title: "Merit Scholarship Recipient", desc: "Academic excellence award, DIATM" },
  { icon: "💻", title: "Open Source Contributor", desc: "Featured contributor to React ecosystem" },
];

// ── SVG ICONS ──
const IconHome = () => <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "currentColor" }}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>;
const IconAbout = () => <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "currentColor" }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>;
const IconSkills = () => <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "currentColor" }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
const IconWork = () => <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "currentColor" }}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" /></svg>;
const IconBlog = () => <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "currentColor" }}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>;
const IconContact = () => <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "currentColor" }}><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>;
const IconGH = () => <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: "currentColor" }}><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" /></svg>;
const IconLI = () => <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: "currentColor" }}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
const IconX = () => <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: "currentColor" }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;

// ── CSS STYLES ──
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
:root{--bg-deep:#0B0B0F;--bg-mid:#111111;--bg-card:#1A1A1D;--white:#F5F5F7;--gray:#9CA3AF;--accent-blue:#3B82F6;--accent-violet:#8B5CF6;--glass-bg:rgba(255,255,255,0.05);--glass-border:rgba(255,255,255,0.1);--font-display:'Syne',sans-serif;--font-body:'DM Sans',sans-serif;}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;scrollbar-width:none;-ms-overflow-style:none;}
html::-webkit-scrollbar{display:none;}
body{background:var(--bg-deep);color:var(--white);font-family:var(--font-body);overflow-x:hidden;cursor:none;}
a{cursor:none;}button{cursor:none;}
.cursor{position:fixed;pointer-events:none;z-index:9999;filter:drop-shadow(0 0 10px rgba(59,130,246,.3));}
.cursor-dot{width:8px;height:8px;background:radial-gradient(circle,white,var(--accent-blue));border-radius:50%;transform:translate(-50%,-50%);animation:morphDot 4s ease-in-out infinite;position:relative;}
.cursor-dot::before,.cursor-dot::after{content:'';position:absolute;width:4px;height:4px;background:var(--accent-violet);border-radius:50%;opacity:.6;}
.cursor-dot::before{top:-12px;left:50%;animation:orbit1 3s linear infinite;}
.cursor-dot::after{top:8px;left:50%;animation:orbit2 2.5s linear infinite;}
.cursor-ring{width:40px;height:40px;border-radius:50%;transform:translate(-50%,-50%);background:conic-gradient(from 0deg,transparent 60%,rgba(59,130,246,.4) 80%,rgba(139,92,246,.4) 100%,transparent);animation:spinRing 4s linear infinite;position:relative;}
.cursor-ring::before{content:'';position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(59,130,246,.15);animation:pulseRing 2s ease-in-out infinite;}
.cursor-ring::after{content:'';position:absolute;inset:8px;border-radius:50%;border:1px dashed rgba(139,92,246,.3);animation:spinRing 6s linear infinite reverse;}
@keyframes morphDot{0%,100%{transform:translate(-50%,-50%) scale(1);box-shadow:0 0 15px rgba(59,130,246,.6)}50%{transform:translate(-50%,-50%) scale(1.2);box-shadow:0 0 25px rgba(139,92,246,.8)}}
@keyframes orbit1{from{transform:translate(-50%,-50%) rotate(0deg) translateX(12px) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg) translateX(12px) rotate(-360deg)}}
@keyframes orbit2{from{transform:translate(-50%,-50%) rotate(0deg) translateX(10px) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(-360deg) translateX(10px) rotate(360deg)}}
@keyframes spinRing{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes pulseRing{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.1);opacity:.6}}
.grain{position:fixed;inset:-50%;width:200%;height:200%;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");opacity:.035;pointer-events:none;z-index:9998;animation:grain 8s steps(10) infinite;}
@keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-5%)}20%{transform:translate(-10%,5%)}30%{transform:translate(5%,-10%)}40%{transform:translate(-5%,15%)}50%{transform:translate(-10%,5%)}60%{transform:translate(15%,0)}70%{transform:translate(0,10%)}80%{transform:translate(-15%,0)}90%{transform:translate(10%,5%)}}
.progress-bar{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--accent-blue),var(--accent-violet));z-index:9999;transform-origin:left;pointer-events:none;}
.section-count{position:fixed;bottom:32px;right:88px;font-family:var(--font-display);font-size:11px;letter-spacing:.15em;color:rgba(255,255,255,.2);z-index:1000;writing-mode:vertical-rl;transform:rotate(180deg);}
.nav-dock{position:fixed;right:24px;top:50%;transform:translateY(-50%);z-index:1000;display:flex;flex-direction:column;gap:10px;background:rgba(255,255,255,0.06);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border:1px solid rgba(255,255,255,0.12);border-radius:50px;padding:16px 10px;box-shadow:0 8px 32px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.08);}
.nav-btn{width:40px;height:40px;border-radius:50%;background:transparent;border:none;display:flex;align-items:center;justify-content:center;cursor:none;color:var(--gray);transition:all .3s cubic-bezier(.23,1,.32,1);position:relative;text-decoration:none;font-size:16px;}
.nav-btn:hover{background:rgba(59,130,246,.18);color:var(--accent-blue);transform:scale(1.15);box-shadow:0 0 16px rgba(59,130,246,.4);}
.nav-btn.active{background:rgba(59,130,246,.2);color:var(--accent-blue);}
.nav-tooltip{position:absolute;right:calc(100% + 12px);background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.15);color:var(--white);font-family:var(--font-body);font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:4px 10px;border-radius:20px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s ease;}
.nav-btn:hover .nav-tooltip{opacity:1;}
section{position:relative;overflow:hidden;}
#hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:0 8vw;background:var(--bg-deep);}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 70% 40%,rgba(59,130,246,.08) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 20% 80%,rgba(139,92,246,.06) 0%,transparent 60%);}
.hero-line{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);}
.hero-eyebrow{font-family:var(--font-body);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--accent-blue);margin-bottom:24px;opacity:0;animation:fadeUp .8s .2s forwards;display:flex;align-items:center;gap:12px;}
.hero-eyebrow::before{content:'';display:inline-block;width:32px;height:1px;background:var(--accent-blue);}
.hero-headline{font-family:var(--font-display);font-size:clamp(52px,8vw,120px);font-weight:800;line-height:.92;letter-spacing:-.04em;color:var(--white);opacity:0;animation:fadeUp .9s .35s forwards;margin-bottom:28px;}
.hero-headline em{font-style:normal;background:linear-gradient(135deg,var(--accent-blue),var(--accent-violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hero-subtitle{font-family:var(--font-body);font-size:clamp(14px,1.4vw,18px);font-weight:300;color:var(--gray);max-width:560px;line-height:1.7;min-height:60px;opacity:0;animation:fadeUp .9s .55s forwards;margin-bottom:48px;}
.typing-cursor{display:inline-block;width:2px;height:1.1em;background:var(--accent-blue);vertical-align:text-bottom;animation:blink 1s step-end infinite;margin-left:2px;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.hero-cta{display:inline-flex;align-items:center;gap:10px;padding:14px 36px;background:linear-gradient(135deg,var(--accent-blue),var(--accent-violet));color:var(--white);font-family:var(--font-body);font-size:13px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;border-radius:100px;border:none;cursor:none;text-decoration:none;opacity:0;animation:fadeUp .9s .75s forwards;position:relative;overflow:hidden;transition:transform .3s cubic-bezier(.23,1,.32,1),box-shadow .3s ease;}
.hero-cta::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.15);opacity:0;transition:opacity .3s;}
.hero-cta:hover{transform:scale(1.04);box-shadow:0 0 36px rgba(59,130,246,.5);}
.hero-cta:hover::after{opacity:1;}
.hero-scroll-hint{position:absolute;bottom:40px;left:8vw;display:flex;align-items:center;gap:12px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.25);opacity:0;animation:fadeUp .8s 1.2s forwards;}
.hero-scroll-hint::after{content:'';width:60px;height:1px;background:linear-gradient(90deg,rgba(255,255,255,.2),transparent);}
.scroll-arrow{width:20px;height:20px;border-right:1px solid rgba(255,255,255,.25);border-bottom:1px solid rgba(255,255,255,.25);transform:rotate(45deg);animation:scrollBounce 2s ease-in-out infinite;margin-top:-6px;}
@keyframes scrollBounce{0%,100%{transform:rotate(45deg) translate(0,0)}50%{transform:rotate(45deg) translate(4px,4px)}}
#about{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;background:var(--bg-mid);}
.about-visual{position:relative;overflow:hidden;background:var(--bg-deep);}
.about-mesh{position:absolute;inset:0;background:radial-gradient(circle at 30% 30%,rgba(59,130,246,.15) 0%,transparent 55%),radial-gradient(circle at 70% 70%,rgba(139,92,246,.1) 0%,transparent 50%);}
.about-grid-lines{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:50px 50px;}
.about-monogram{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:clamp(120px,20vw,220px);font-weight:800;color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.06);letter-spacing:-.05em;user-select:none;}
.about-photo{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:800px;object-fit:contain;object-position:bottom;mix-blend-mode:lighten;filter:contrast(1.05) brightness(1.02);z-index:2;mask-image:linear-gradient(to top,rgba(0,0,0,1) 60%,rgba(0,0,0,0) 100%);-webkit-mask-image:linear-gradient(to top,rgba(0,0,0,1) 60%,rgba(0,0,0,0) 100%);animation:floatPhoto 6s ease-in-out infinite;}
@keyframes floatPhoto{0%,100%{transform:translateX(-50%) translateY(0px)}50%{transform:translateX(-50%) translateY(-10px)}}
.about-badge{position:absolute;bottom:48px;left:48px;background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:20px;padding:20px 24px;font-family:var(--font-body);}
.about-badge-num{font-family:var(--font-display);font-size:42px;font-weight:800;background:linear-gradient(135deg,var(--accent-blue),var(--accent-violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.about-badge-label{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--gray);margin-top:2px;}
.about-content{padding:clamp(60px,8vw,120px) clamp(40px,6vw,100px);display:flex;flex-direction:column;justify-content:center;}
.section-eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--accent-blue);margin-bottom:20px;display:flex;align-items:center;gap:12px;}
.section-eyebrow::before{content:'';width:24px;height:1px;background:var(--accent-blue);}
.section-title{font-family:var(--font-display);font-size:clamp(36px,4vw,64px);font-weight:800;line-height:1;letter-spacing:-.03em;color:var(--white);margin-bottom:28px;}
.about-body{font-size:16px;font-weight:300;color:var(--gray);line-height:1.8;max-width:480px;margin-bottom:40px;}
.about-tags{display:flex;flex-wrap:wrap;gap:8px;}
.about-tag{padding:6px 16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:100px;font-size:12px;letter-spacing:.08em;color:rgba(255,255,255,.6);transition:all .25s ease;}
.about-tag:hover{background:rgba(59,130,246,.1);border-color:rgba(59,130,246,.3);color:var(--accent-blue);}
#skills{padding:120px 0;background:var(--bg-deep);overflow:hidden;}
#skills .inner{padding:0 8vw;margin-bottom:60px;}
.marquee-track{display:flex;gap:20px;width:max-content;animation:marquee 30s linear infinite;}
.marquee-track-reverse{animation-direction:reverse;animation-duration:25s;}
.marquee-row{overflow:hidden;margin-bottom:20px;}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
section{position:relative;transform-style:preserve-3d;will-change:transform;transition:transform .3s ease-out;}
section:not(#hero){position:sticky;top:0;z-index:10;}
#about{z-index:11;}
#skills{z-index:12;}
#projects{z-index:13;}
#blog{z-index:14;}
#contact{z-index:15;}
.skill-card{flex-shrink:0;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;transition:all .3s cubic-bezier(.23,1,.32,1);cursor:none;box-shadow:inset 0 1px 0 rgba(255,255,255,.06);position:relative;overflow:hidden;}
.skill-card::before{content:'';position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 50% 0%,rgba(255,255,255,.04),transparent 60%);}
.skill-card:hover{background:rgba(59,130,246,.08);border-color:rgba(59,130,246,.3);transform:scale(1.08);box-shadow:0 0 28px rgba(59,130,246,.25),inset 0 1px 0 rgba(59,130,246,.2);}
.skill-logo{width:38px;height:38px;object-fit:contain;filter:brightness(.9) saturate(.8);transition:filter .3s;}
.skill-card:hover .skill-logo{filter:brightness(1.1) saturate(1);}
.skill-name{font-size:10px;font-family:var(--font-body);letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.45);transition:color .3s;}
.skill-card:hover .skill-name{color:rgba(255,255,255,.8);}
#projects{padding:120px 8vw;background:var(--bg-mid);}
.projects-grid{margin-top:60px;display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;}
.project-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:20px;padding:36px;position:relative;overflow:hidden;transition:all .4s cubic-bezier(.23,1,.32,1);cursor:none;}
.project-card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(59,130,246,.07) 0%,transparent 60%);opacity:0;transition:opacity .4s;}
.project-card:hover{transform:translateY(-6px);border-color:rgba(59,130,246,.2);}
.project-card:hover::before{opacity:1;}
.project-num{font-family:var(--font-display);font-size:11px;letter-spacing:.15em;color:rgba(255,255,255,.2);margin-bottom:20px;}
.project-title{font-family:var(--font-display);font-size:22px;font-weight:700;color:var(--white);margin-bottom:12px;line-height:1.2;}
.project-desc{font-size:14px;font-weight:300;color:var(--gray);line-height:1.6;margin-bottom:28px;}
.project-link{display:inline-flex;align-items:center;gap:8px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent-blue);text-decoration:none;position:relative;transition:gap .3s ease;}
.project-link::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:1px;background:var(--accent-blue);transform:scaleX(0);transform-origin:left;transition:transform .3s ease;}
.project-link:hover::after{transform:scaleX(1);}
.project-link:hover{gap:14px;}
.project-arrow{width:16px;height:16px;transition:transform .3s;display:flex;}
.project-link:hover .project-arrow{transform:translate(3px,-3px);}
.project-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px;}
.project-tag{font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding:3px 10px;border-radius:100px;background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.2);color:rgba(139,92,246,.9);}
#blog{padding:120px 8vw;background:var(--bg-deep);}
.blog-grid{margin-top:60px;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;}
.blog-card{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:16px;padding:32px;cursor:none;transition:all .35s cubic-bezier(.23,1,.32,1);position:relative;overflow:hidden;}
.blog-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent-blue),var(--accent-violet));transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.23,1,.32,1);}
.blog-card:hover{transform:translateY(-4px);border-color:rgba(255,255,255,.12);}
.blog-card:hover::after{transform:scaleX(1);}
.blog-tag{display:inline-block;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--accent-blue);margin-bottom:16px;}
.blog-title{font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--white);line-height:1.25;margin-bottom:14px;letter-spacing:-.02em;}
.blog-excerpt{font-size:13px;font-weight:300;color:var(--gray);line-height:1.65;margin-bottom:24px;}
.blog-meta{display:flex;align-items:center;justify-content:space-between;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.25);}
.blog-read{color:var(--accent-blue);text-decoration:none;font-size:11px;letter-spacing:.1em;text-transform:uppercase;transition:opacity .2s;}
.blog-read:hover{opacity:.7;}
#contact{padding:120px 8vw;background:var(--bg-mid);position:relative;}
.contact-bg-text{position:absolute;bottom:-40px;left:0;right:0;font-family:var(--font-display);font-size:clamp(60px,12vw,160px);font-weight:800;color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.04);letter-spacing:-.04em;text-align:center;user-select:none;pointer-events:none;white-space:nowrap;overflow:hidden;}
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;margin-top:60px;position:relative;z-index:1;}
.contact-quote{font-family:var(--font-display);font-size:clamp(24px,3vw,40px);font-weight:700;line-height:1.2;letter-spacing:-.02em;color:rgba(255,255,255,.12);position:relative;padding-top:60px;}
.contact-quote-mark{position:absolute;top:0;left:0;font-family:var(--font-display);font-size:80px;line-height:1;font-weight:800;background:linear-gradient(135deg,var(--accent-blue),var(--accent-violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.contact-quote em{font-style:normal;color:var(--white);opacity:.7;}
.contact-form{display:flex;flex-direction:column;gap:20px;}
.form-field{position:relative;}
.form-field input,.form-field textarea{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:22px 20px 10px;color:var(--white);font-family:var(--font-body);font-size:15px;font-weight:300;outline:none;transition:border-color .3s ease,box-shadow .3s ease;resize:none;}
.form-field textarea{height:140px;}
.form-field input:focus,.form-field textarea:focus{border-color:rgba(59,130,246,.5);box-shadow:0 0 0 3px rgba(59,130,246,.08);}
.form-field label{position:absolute;top:16px;left:20px;font-size:13px;letter-spacing:.04em;color:var(--gray);pointer-events:none;transition:all .25s cubic-bezier(.23,1,.32,1);}
.form-field input:focus~label,.form-field input:not(:placeholder-shown)~label,.form-field textarea:focus~label,.form-field textarea:not(:placeholder-shown)~label{top:8px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent-blue);}
.form-field input::placeholder,.form-field textarea::placeholder{color:transparent;}
.submit-btn{padding:16px 40px;background:linear-gradient(135deg,var(--accent-blue),var(--accent-violet));border:none;border-radius:100px;color:var(--white);font-family:var(--font-body);font-size:13px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:none;transition:all .3s cubic-bezier(.23,1,.32,1);align-self:flex-start;}
.submit-btn:hover{transform:scale(1.04);box-shadow:0 0 36px rgba(59,130,246,.45);}
footer{padding:48px 8vw;background:var(--bg-deep);border-top:1px solid rgba(255,255,255,.05);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;}
.footer-brand{font-family:var(--font-display);font-size:18px;font-weight:800;letter-spacing:-.02em;background:linear-gradient(135deg,var(--white),var(--gray));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.footer-copy{font-size:12px;letter-spacing:.06em;color:rgba(255,255,255,.25);}
.social-links{display:flex;gap:16px;}
.social-link{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:var(--gray);text-decoration:none;transition:all .3s cubic-bezier(.23,1,.32,1);}
.social-link:hover{background:rgba(59,130,246,.15);border-color:rgba(59,130,246,.3);color:var(--accent-blue);transform:scale(1.1);}
.reveal{opacity:0;transform:translateY(40px);transition:opacity .8s cubic-bezier(.23,1,.32,1),transform .8s cubic-bezier(.23,1,.32,1);}
.reveal.visible{opacity:1;transform:translateY(0);}
.section-divider{width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent);margin:0;}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:900px){.nav-dock{right:12px;}#about{grid-template-columns:1fr;}.about-visual{min-height:320px;}.contact-grid{grid-template-columns:1fr;gap:40px;}.projects-grid{grid-template-columns:1fr;}}
@media(max-width:600px){.hero-headline{font-size:42px;}#hero{padding:0 6vw;}footer{flex-direction:column;text-align:center;}.nav-dock{right:10px;padding:12px 8px;}.nav-btn{width:34px;height:34px;font-size:14px;}}
`;

// ── REVEAL HOOK ──
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── REVEAL WRAPPER ──
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref}
      className={"reveal" + (visible ? " visible" : "") + (className ? " " + className : "")}
      style={{ transitionDelay: delay + "s" }}>
      {children}
    </div>
  );
}

// ── SKILL CARD ──
function SkillCard({ name, logo }) {
  return (
    <div className="skill-card">
      <img src={logo} alt={name} className="skill-logo"
        onError={e => { e.target.src = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2238%22 height=%2238%22><rect width=%2238%22 height=%2238%22 rx=%2219%22 fill=%22rgba(255,255,255,.08)%22/></svg>"; }} />
      <span className="skill-name">{name}</span>
    </div>
  );
}

// ── PROJECT CARD ──
function ProjectCard({ num, title, desc, problem, solution, impact, tags, url, delay }) {
  const [ref, visible] = useReveal();
  const cardRef = useRef(null);
  const handleMouseMove = useCallback((e) => {
    const r = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
    cardRef.current.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
  }, []);
  return (
    <div ref={el => { ref.current = el; cardRef.current = el; }}
      className={"project-card reveal" + (visible ? " visible" : "")}
      style={{ transitionDelay: delay + "s" }}
      onMouseMove={handleMouseMove}>
      <div className="project-num">{num} / 0{PROJECTS.length}</div>
      <h3 className="project-title">{title}</h3>
      <p className="project-desc">{desc}</p>
      <div style={{ background: 'rgba(255,255,255,.03)', borderLeft: '2px solid var(--accent-blue)', padding: '12px 16px', marginBottom: '20px', borderRadius: '4px' }}>
        <div style={{ fontSize: '11px', marginBottom: '8px' }}><span style={{ color: 'var(--accent-blue)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Problem:</span> <span style={{ color: 'rgba(255,255,255,.6)' }}>{problem}</span></div>
        <div style={{ fontSize: '11px', marginBottom: '8px' }}><span style={{ color: 'var(--accent-violet)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Solution:</span> <span style={{ color: 'rgba(255,255,255,.6)' }}>{solution}</span></div>
        <div style={{ fontSize: '11px' }}><span style={{ color: '#10b981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Impact:</span> <span style={{ color: 'rgba(255,255,255,.7)', fontWeight: 500 }}>{impact}</span></div>
      </div>
      <div className="project-tags">{tags.map(t => <span key={t} className="project-tag">{t}</span>)}</div>
      <a href={url} target="_blank" rel="noreferrer" className="project-link">
        View on GitHub
        <span className="project-arrow">
          <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
        </span>
      </a>
    </div>
  );
}

// ── BLOG CARD ──
function BlogCard({ tag, title, excerpt, date, read, delay }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={"blog-card reveal" + (visible ? " visible" : "")} style={{ transitionDelay: delay + "s" }}>
      <span className="blog-tag">{tag}</span>
      <h3 className="blog-title">{title}</h3>
      <p className="blog-excerpt">{excerpt}</p>
      <div className="blog-meta">
        <span>{date} · {read}</span>
        <a href="#" className="blog-read">Read →</a>
      </div>
    </div>
  );
}

// ── TYPING SUBTITLE ──
function TypingSubtitle() {
  const [displayed, setDisplayed] = useState("");
  const idxRef = useRef(0);
  useEffect(() => {
    const t = setTimeout(() => {
      function tick() {
        if (idxRef.current <= FULL_TEXT.length) {
          setDisplayed(FULL_TEXT.slice(0, idxRef.current));
          idxRef.current++;
          setTimeout(tick, idxRef.current === 1 ? 800 : 28);
        }
      }
      tick();
    }, 1200);
    return () => clearTimeout(t);
  }, []);
  return <p className="hero-subtitle">{displayed}<span className="typing-cursor" /></p>;
}

// ── NAV DOCK ──
function NavDock({ activeSection }) {
  const items = [
    { id: "hero", Icon: IconHome, label: "Home" },
    { id: "about", Icon: IconAbout, label: "About" },
    { id: "skills", Icon: IconSkills, label: "Skills" },
    { id: "projects", Icon: IconWork, label: "Projects" },
    { id: "blog", Icon: IconBlog, label: "Blog" },
    { id: "contact", Icon: IconContact, label: "Contact" },
  ];
  return (
    <nav className="nav-dock">
      {items.map(({ id, Icon, label }) => (
        <a key={id} href={"#" + id} className={"nav-btn" + (activeSection === id ? " active" : "")}>
          <Icon /><span className="nav-tooltip">{label}</span>
        </a>
      ))}
    </nav>
  );
}

// ── CONTACT FORM ──
function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const handle = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }, 3000);
  };
  const fields = [
    { id: "name", type: "text", label: "Your Name", req: true },
    { id: "email", type: "email", label: "Email Address", req: true },
    { id: "subject", type: "text", label: "Subject", req: false },
  ];
  return (
    <form className="contact-form" onSubmit={handle}>
      {fields.map(f => (
        <div key={f.id} className="form-field">
          <input type={f.type} id={f.id} placeholder={f.label} required={f.req}
            value={form[f.id]} onChange={e => setForm({ ...form, [f.id]: e.target.value })} />
          <label htmlFor={f.id}>{f.label}</label>
        </div>
      ))}
      <div className="form-field">
        <textarea id="message" placeholder="Message" required
          value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
        <label htmlFor="message">Your Message</label>
      </div>
      <button type="submit" className="submit-btn"
        style={submitted ? { background: "linear-gradient(135deg,#10b981,#059669)" } : {}}>
        {submitted ? "Message Sent ✓" : "Send Message →"}
      </button>
    </form>
  );
}

const Divider = () => <div className="section-divider" />;

// ══════════════════════════════════════════
// ── MAIN APP COMPONENT ──
// ══════════════════════════════════════════
export default function Portfolio({ heroRef }) {
  const [activeSection, setActiveSection] = useState("hero");
  const [sectionCount, setSectionCount] = useState("01");
  const [progress, setProgress] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const ringRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(null);
  // Photo stored as state to avoid re-render on every paint




  // Custom cursor
  useEffect(() => {
    const onMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    function animRing() {
      ringRef.current.x += (targetRef.current.x - ringRef.current.x) * 0.12;
      ringRef.current.y += (targetRef.current.y - ringRef.current.y) * 0.12;
      setRingPos({ x: ringRef.current.x, y: ringRef.current.y });
      animRef.current = requestAnimationFrame(animRing);
    }
    animRef.current = requestAnimationFrame(animRing);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(animRef.current); };
  }, []);

  // Scroll: progress + parallax
  useEffect(() => {
    const onScroll = () => {
      setProgress(window.scrollY / (document.body.scrollHeight - window.innerHeight));
      const heroBg = document.querySelector(".hero-bg");
      if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      const mono = document.querySelector(".about-monogram");
      if (mono) {
        const top = document.getElementById("about")?.offsetTop || 0;
        mono.style.transform = `translateY(${(window.scrollY - top) * 0.15}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setActiveSection(e.target.id);
          setSectionCount(SECTION_LABELS[e.target.id] || "01");
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const half = Math.ceil(SKILLS.length / 2);
  const row1 = [...SKILLS.slice(0, half), ...SKILLS.slice(0, half)];
  const row2 = [...SKILLS.slice(half), ...SKILLS.slice(half)];

  return (
    <>
      <LoadingBar progress={progress} />
      <style>{CSS}</style>

      {/* Progress Bar */}
      <div className="progress-bar" style={{ transform: `scaleX(${progress})` }} />

      {/* Grain */}
      <div className="grain" />

      {/* Cursors */}
      <div className="cursor" style={{ left: cursorPos.x, top: cursorPos.y }}><div className="cursor-dot" /></div>
      <div className="cursor" style={{ left: ringPos.x, top: ringPos.y }}><div className="cursor-ring" /></div>

      {/* Section counter */}
      <div className="section-count">{sectionCount} / 06</div>

      {/* Nav Dock */}
      <NavDock activeSection={activeSection} />

      {/* ══ HERO ══ */}
      <section id="hero">
        <div className="hero-bg" />
        <div className="hero-line" style={{ top: "20%" }} />
        <div className="hero-line" style={{ top: "80%" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 className="hero-headline" ref={heroRef}><em>Shubhsanket Sharma</em></h1>
          <p className="hero-expertise" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(13px,1.2vw,15px)', fontWeight: 500, color: 'var(--accent-blue)', letterSpacing: '.08em', textTransform: 'uppercase', opacity: 0, animation: 'fadeUp .9s .45s forwards', marginBottom: '16px' }}>React Expert · AI/ML Practitioner · Blockchain Developer</p>
          <TypingSubtitle />
          <div className="hero-cta-group" style={{ display: 'flex', gap: '16px', alignItems: 'center', opacity: 0, animation: 'fadeUp .9s .75s forwards', marginBottom: '40px' }}>
            <a href="#projects" className="hero-cta">
              View My Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,.4)', maxWidth: '200px', lineHeight: 1.5 }}>Ready to see how I can solve your toughest technical challenges?</p>
          </div>
          <div className="hero-links" style={{ display: 'flex', gap: '20px', opacity: 0, animation: 'fadeUp .9s .95s forwards' }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', textDecoration: 'none', transition: 'color .3s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-blue)'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.5)'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 3h10c.55 0 1 .45 1 1v16l-6-3-6 3V4c0-.55.45-1 1-1z" /></svg>
              Resume / CV
            </a>
            <a href="https://linkedin.com/in/shubhsanket" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', textDecoration: 'none', transition: 'color .3s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-blue)'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.5)'}>
              <IconLI />
              LinkedIn
            </a>
            <a href="https://github.com/shubhsanket" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', textDecoration: 'none', transition: 'color .3s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-blue)'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.5)'}>
              <IconGH />
              GitHub Profile
            </a>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <div className="scroll-arrow" />
          Scroll to explore
        </div>
      </section>

      {/* Trust Bar */}
      <div style={{ background: 'rgba(255,255,255,.02)', borderTop: '1px solid rgba(255,255,255,.06)', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '24px 8vw', opacity: 0, animation: 'fadeUp .9s 1.05s forwards', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent-blue)"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)' }}>Trusted by developers & startups</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.25)' }}>
            <span>React · Next.js</span>
            <span>TensorFlow · PyTorch</span>
            <span>Polygon · Ethereum</span>
            <span>Firebase · Supabase</span>
          </div>
        </div>
      </div>

      <Divider />

      {/* ══ ABOUT ══ */}
      <section id="about">
        <div className="about-visual">
          <div className="about-mesh" />
          <div className="about-grid-lines" />
          <div className="about-monogram">SS</div>
          <img src={PHOTO_SRC} alt="Shubhsanket Sharma" className="about-photo" />
          <Reveal className="about-badge">
            <div className="about-badge-num">2nd</div>
            <div className="about-badge-label">Year · B.Tech CSE</div>
          </Reveal>
        </div>
        <div className="about-content">
          <Reveal><div className="section-eyebrow">About Me</div></Reveal>
          <Reveal delay={0.1}><h2 className="section-title">Building at the<br />intersection of<br />everything.</h2></Reveal>
          <Reveal delay={0.2}>
            <p className="about-body">I am Shubhsanket Sharma, a 2nd-year B.Tech CSE student at Durgapur Institute of Advanced Technology and Management. I specialize in architecting production-grade full-stack applications, training and deploying AI/ML models, and building decentralized protocols on Ethereum and Polygon. My work helps startups ship faster, teams reduce technical debt, and users experience seamless digital products.</p>
          </Reveal>
          <Reveal delay={0.25}>
            <div style={{ background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.2)', borderRadius: '12px', padding: '20px 24px', marginBottom: '32px' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent-blue)', marginBottom: '12px' }}>Notable Achievements</div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {ACHIEVEMENTS.map((a, i) => (<div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ fontSize: '18px' }}>{a.icon}</span><div><div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--white)', marginBottom: '2px' }}>{a.title}</div><div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--gray)' }}>{a.desc}</div></div></div>))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="about-tags">
              {["Full-Stack Dev", "AI / ML", "Web3 / Blockchain", "System Design", "UI/UX", "Open Source"].map(t => (
                <span key={t} className="about-tag">{t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ══ SKILLS ══ */}
      <section id="skills">
        <div className="inner">
          <Reveal><div className="section-eyebrow">Technical Arsenal</div></Reveal>
          <Reveal delay={0.1}><h2 className="section-title">Technologies I<br />work with.</h2></Reveal>
        </div>
        <div className="marquee-row">
          <div className="marquee-track">{row1.map((s, i) => <SkillCard key={i} {...s} />)}</div>
        </div>
        <div className="marquee-row">
          <div className="marquee-track marquee-track-reverse">{row2.map((s, i) => <SkillCard key={i} {...s} />)}</div>
        </div>
      </section>

      <Divider />

      {/* ══ PROJECTS ══ */}
      <section id="projects">
        <Reveal><div className="section-eyebrow">Selected Work · Real Impact</div></Reveal>
        <Reveal delay={0.1}><h2 className="section-title">Projects that<br />push boundaries.</h2></Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--gray)', maxWidth: '600px', lineHeight: 1.7, marginTop: '16px', marginBottom: '20px' }}>Every project below follows a <strong style={{ color: 'var(--white)' }}>Problem → Solution → Impact</strong> framework. I don't just build features—I solve real challenges with measurable outcomes.</p>
        </Reveal>
        <div className="projects-grid">
          {PROJECTS.map((p, i) => <ProjectCard key={p.num} {...p} delay={i * 0.08} />)}
        </div>
      </section>

      <Divider />

      {/* ══ BLOG ══ */}
      <section id="blog">
        <Reveal><div className="section-eyebrow">Writing</div></Reveal>
        <Reveal delay={0.1}><h2 className="section-title">Thoughts &amp;<br />Perspectives.</h2></Reveal>
        <div className="blog-grid">
          {BLOGS.map((b, i) => <BlogCard key={i} {...b} delay={i * 0.1} />)}
        </div>
      </section>

      <Divider />

      {/* ══ CONTACT ══ */}
      <section id="contact">
        <Reveal><div className="section-eyebrow">Get In Touch · Let's Collaborate</div></Reveal>
        <Reveal delay={0.1}><h2 className="section-title">Let&apos;s build<br />something remarkable.</h2></Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--gray)', maxWidth: '600px', lineHeight: 1.7, marginTop: '16px', marginBottom: '20px' }}>Whether you need a full-stack developer to ship your MVP, an AI engineer to build intelligent systems, or a Web3 consultant to architect decentralized protocols—<strong style={{ color: 'var(--white)' }}>I'm here to turn your vision into production-ready reality.</strong></p>
        </Reveal>
        <div className="contact-grid">
          <Reveal delay={0.2}>
            <div className="contact-quote">
              <div className="contact-quote-mark">"</div>
              The best systems are <em>invisible to the user</em> but <em>unstoppable</em> in architecture.
            </div>
          </Reveal>
          <Reveal delay={0.3}><ContactForm /></Reveal>
        </div>
        <div className="contact-bg-text">CONTACT</div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer>
        <div className="footer-brand">SS.</div>
        <p className="footer-copy">© 2025 Shubhsanket Sharma · Crafted with intention</p>
        <div className="social-links">
          <a href="https://github.com/shubhsanket" target="_blank" rel="noreferrer" className="social-link"><IconGH /></a>
          <a href="https://linkedin.com/in/shubhsanket" target="_blank" rel="noreferrer" className="social-link"><IconLI /></a>
          <a href="https://twitter.com/shubhsanket" target="_blank" rel="noreferrer" className="social-link"><IconX /></a>
        </div>
      </footer>
    </>
  );
}