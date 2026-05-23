import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimations(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root.querySelectorAll("[data-reveal], [data-reveal-child]").forEach((el) => {
        el.classList.add("is-visible");
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.from(".noir-portrait-frame", {
        opacity: 0,
        scale: 0.94,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.15,
      });

      gsap.from(".noir-name-left", {
        opacity: 0,
        x: -36,
        duration: 1,
        ease: "power3.out",
        delay: 0.25,
      });

      gsap.from(".noir-name-right", {
        opacity: 0,
        x: 36,
        duration: 1,
        ease: "power3.out",
        delay: 0.25,
      });

      root.querySelectorAll("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
              once: true,
            },
          }
        );
      });

      root.querySelectorAll("[data-reveal-stagger]").forEach((container) => {
        const children = container.querySelectorAll("[data-reveal-child]");
        if (!children.length) return;

        gsap.fromTo(
          children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: container,
              start: "top 84%",
              once: true,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}
