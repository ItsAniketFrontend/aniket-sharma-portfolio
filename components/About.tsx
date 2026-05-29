import Tilt from "./Tilt";

const stats = [
  { value: 6, suffix: " yrs", label: "Building for the web and mobile" },
  { value: 40, suffix: "+", label: "Products shipped to real users" },
  { value: 12, suffix: "", label: "Teams shipped alongside" },
];

export default function About() {
  return (
    <section id="about" className="px-4 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <p className="reveal mb-10 text-sm font-medium text-flame">About</p>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.4fr_1fr]">
          <h2 className="flip-up font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.1] text-balance">
            I care about the last ten percent. The part where a product stops
            feeling generic and starts feeling{" "}
            <span className="text-flame">considered</span>.
          </h2>

          <div className="reveal space-y-6 text-bone-dim">
            <p>
              I work across the whole stack, from database schema to the way a
              button settles when you let go. Most of my time goes into web apps
              with Next.js and mobile apps with React Native.
            </p>
            <p>
              Before freelancing I led front-end work on a fintech dashboard and
              a logistics platform, so I am comfortable owning a feature from a
              fuzzy brief all the way to production.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <Tilt
              key={s.label}
              max={9}
              className="reveal-3d group rounded-[var(--radius-card)] bg-surface/50 p-7 hairline"
            >
              <p className="font-display text-4xl font-extrabold text-bone">
                <span className="count" data-count={s.value}>
                  0
                </span>
                {s.suffix}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {s.label}
              </p>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
