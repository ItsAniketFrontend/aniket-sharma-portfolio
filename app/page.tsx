"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";

import { heroScroll, pageScroll } from "@/lib/scroll";
import SceneBackgroundCanvas from "@/components/SceneBackgroundCanvas";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Work from "@/components/Work";
import Capabilities from "@/components/Capabilities";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, useGSAP);

export default function Page() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Reduced-motion path: show everything, animate nothing.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero load reveal. Transform and opacity only.
        gsap.from(".hero-rise", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          delay: 0.1,
        });

        // SplitText: hero headline reveals character by character behind a mask.
        const title = document.querySelector<HTMLElement>(".hero-title");
        if (title) {
          const split = SplitText.create(title, { type: "words,chars", mask: "chars" });
          gsap.from(split.chars, {
            yPercent: 120,
            opacity: 0,
            stagger: 0.016,
            duration: 0.7,
            ease: "power3.out",
            delay: 0.15,
          });
        }

        // SplitText: closing headline reveals line by line on scroll.
        gsap.utils.toArray<HTMLElement>(".split-reveal").forEach((el) => {
          const split = SplitText.create(el, { type: "lines,words", mask: "lines" });
          gsap.from(split.lines, {
            yPercent: 110,
            opacity: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });

        // Scroll reveals, triggered per element as it enters.
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.from(el, {
            y: 32,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });

        // 1. Page-wide scroll progress bar.
        gsap.to(".scroll-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            onUpdate: (self) => {
              pageScroll.progress = self.progress;
            },
          },
        });

        // 3D flip-in reveals: cards tilt up onto a perspective as they enter.
        gsap.utils.toArray<HTMLElement>(".reveal-3d").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 64,
            rotationX: 30,
            transformOrigin: "50% 100%",
            transformPerspective: 1000,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });
        });

        // 3D heading flip: section titles hinge up from their baseline.
        gsap.utils.toArray<HTMLElement>(".flip-up").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            rotationX: -75,
            y: 20,
            transformOrigin: "50% 0%",
            transformPerspective: 900,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });

        // 2. Hero parallax out, plus a scroll link into the 3D scene.
        gsap.to(".hero-text", {
          yPercent: -14,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: "#top",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".hero-visual", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: "#top",
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              heroScroll.progress = self.progress;
            },
          },
        });

        // 3. Depth parallax for any element opting in with data-speed.
        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
          const speed = parseFloat(el.dataset.speed || "0");
          gsap.to(el, {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        });

        // 4. Bento feature image drifts slower than its frame.
        gsap.fromTo(
          ".bento-img",
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: ".bento-img",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        // 5. Process track fills as the section passes through the viewport.
        gsap.to(".process-line", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "#process",
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        });

        // 6. Stat count-ups, once, when they enter.
        gsap.utils.toArray<HTMLElement>(".count").forEach((el) => {
          const target = Number(el.dataset.count || "0");
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            snap: { v: 1 },
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v));
            },
          });
        });
      });

      // Pinned horizontal showcase, desktop only (mobile keeps a vertical stack).
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = root.current?.querySelector<HTMLElement>(".work-track");
          const section = root.current?.querySelector<HTMLElement>(".work-pin");
          if (!track || !section) return;

          const distance = () => track.scrollWidth - window.innerWidth;

          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + distance(),
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".hero-rise", ".reveal", ".reveal-3d", ".flip-up"], {
          opacity: 1,
          y: 0,
          rotationX: 0,
        });
        gsap.set(".process-line", { scaleX: 1 });
        gsap.utils.toArray<HTMLElement>(".count").forEach((el) => {
          el.textContent = el.dataset.count || "0";
        });
      });
    },
    { scope: root }
  );

  // Smooth in-page navigation with ScrollToPlugin (jumps instantly when the
  // visitor prefers reduced motion).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      gsap.to(window, {
        duration: reduce ? 0 : 1,
        ease: "power2.inOut",
        scrollTo: { y: target, offsetY: 72 },
      });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={root}>
      {/* Fixed 3D geometry field that sits behind every section for depth. */}
      <div className="pointer-events-none fixed inset-0 z-0 hidden opacity-70 md:block">
        <SceneBackgroundCanvas />
      </div>

      <div className="scroll-progress fixed left-0 top-0 z-[60] h-[3px] w-full origin-left scale-x-0 bg-flame" />

      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <About />
          <Work />
          <Capabilities />
          <Process />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
