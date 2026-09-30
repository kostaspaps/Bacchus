"use client";
import { useEffect } from "react";
import { captureUtm } from "@/lib/analytics";

/**
 * Global motion behaviours from the prototype:
 *  - [data-reveal] elements get data-shown when 12% visible (one-shot)
 *  - [data-parallax="0.06"] images translate on scroll
 *  - video[data-inview-video] plays only when ≥50% in view; data-start loops back to that second
 * All respect prefers-reduced-motion. Also captures UTM/gclid into sessionStorage.
 */
export default function Effects() {
  useEffect(() => {
    captureUtm();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-shown", "");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    const vio = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement & { dataset: DOMStringMap };
          const start = parseFloat(v.dataset.start || "0");
          if (start && !v.dataset.loopFix) {
            v.dataset.loopFix = "1";
            v.addEventListener("timeupdate", () => {
              if (v.currentTime < start - 0.05) v.currentTime = start;
            });
            v.addEventListener("ended", () => {
              v.currentTime = start;
              v.play().catch(() => {});
            });
          }
          if (e.isIntersecting && e.intersectionRatio >= 0.5 && !reduce) {
            if (start && v.currentTime < start) v.currentTime = start;
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }),
      { threshold: [0, 0.5] },
    );

    const observeAll = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown]):not([data-io])").forEach((el) => {
        el.setAttribute("data-io", "");
        io.observe(el);
      });
      document.querySelectorAll<HTMLVideoElement>("video[data-inview-video]:not([data-vio])").forEach((v) => {
        v.setAttribute("data-vio", "");
        vio.observe(v);
      });
    };
    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    let raf = 0;
    const parallax = () => {
      raf = 0;
      if (reduce) return;
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((img) => {
        const parent = img.parentElement;
        if (!parent) return;
        const r = parent.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        img.style.transform = `translateY(${(-p * parseFloat(img.dataset.parallax || "0") * 100).toFixed(2)}%)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(parallax);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      io.disconnect();
      vio.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
