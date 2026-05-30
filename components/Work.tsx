import Tilt from "./Tilt";

type Project = {
  name: string;
  category: string;
  year: string;
  stack: string;
  seed: string;
};

const projects: Project[] = [
  {
    name: "Tend",
    category: "Mobile app for plant care reminders",
    year: "2025",
    stack: "React Native, Expo, Supabase",
    seed: "tend-plant-app",
  },
  {
    name: "Harbor",
    category: "Logistics dashboard for a freight startup",
    year: "2024",
    stack: "Next.js, PostgreSQL, Mapbox",
    seed: "harbor-logistics",
  },
  {
    name: "Cadence",
    category: "Web app for remote music collaboration",
    year: "2024",
    stack: "React, WebRTC, Node.js",
    seed: "cadence-music-studio",
  },
  {
    name: "Folio",
    category: "Headless storefront for an apparel label",
    year: "2023",
    stack: "Next.js, Shopify, Stripe",
    seed: "folio-storefront",
  },
];

/*
  Pinned horizontal showcase. On desktop the section pins and the track pans
  sideways as you scroll (wired in page.tsx with ScrollTrigger). On mobile and
  under reduced motion it falls back to a normal vertical stack.
*/
export default function Work() {
  return (
    <section id="work" className="work-pin relative">
      <div className="md:flex md:h-[100dvh] md:items-center md:overflow-hidden">
        <div className="work-track flex flex-col gap-6 px-4 py-24 will-change-transform md:flex-row md:flex-nowrap md:gap-8 md:py-0 md:pl-[8vw] md:pr-[12vw]">
          {/* Intro panel travels in as the first card */}
          <div className="flex shrink-0 flex-col justify-center md:w-[36vw] lg:w-[30vw]">
            <span className="reveal text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Selected work
            </span>
            <h2 className="flip-up mt-4 font-display text-[clamp(2rem,5vw,3.6rem)] font-bold leading-[1.04]">
              Things I have built
            </h2>
            <p className="reveal mt-5 max-w-sm text-muted">
              A few projects from the last couple of years. Each one shipped and
              in the hands of real users.
            </p>
            <div className="reveal mt-8 flex items-center gap-3 text-sm text-flame">
              <span className="h-px w-10 bg-flame" />
              {projects.length} projects
            </div>
          </div>

          {projects.map((p) => (
            <Tilt
              key={p.name}
              max={6}
              className="work-card group flex shrink-0 flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface/40 hairline md:w-[40vw] lg:w-[32vw]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${p.seed}/800/600`}
                  alt={p.category}
                  className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] md:h-72"
                  loading="lazy"
                />
                <span className="absolute left-4 top-4 rounded-[var(--radius-pill)] bg-ink/70 px-3 py-1 text-xs text-bone backdrop-blur hairline">
                  {p.year}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <h3 className="font-display text-2xl font-bold transition-colors duration-300 group-hover:text-flame md:text-3xl">
                  {p.name}
                </h3>
                <p className="mt-2 text-sm text-muted">{p.category}</p>
                <p className="mt-auto pt-5 text-xs text-bone-dim">{p.stack}</p>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
