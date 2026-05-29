"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // IntersectionObserver on a top sentinel instead of a scroll listener,
  // per taste-skill (no window scroll handlers).
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;height:24px;width:1px;";
    document.body.prepend(sentinel);
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "0px" }
    );
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-[var(--radius-pill)] px-5 py-3 transition-all duration-500 ${
          scrolled
            ? "bg-ink-2/80 hairline backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        }`}
      >
        <a href="#top" className="font-display text-lg font-extrabold tracking-tight">
          Aniket<span className="text-flame">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-muted transition-colors hover:text-bone"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-[var(--radius-pill)] bg-bone px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-flame md:inline-block"
        >
          Get in touch
        </a>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full hairline md:hidden"
        >
          <span className="text-bone">{open ? "✕" : "≡"}</span>
        </button>
      </nav>

      {open && (
        <div className="absolute top-20 w-[calc(100%-2rem)] max-w-6xl rounded-[var(--radius-card)] bg-ink-2/95 p-4 hairline backdrop-blur-xl md:hidden">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base text-bone transition-colors hover:bg-surface"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
