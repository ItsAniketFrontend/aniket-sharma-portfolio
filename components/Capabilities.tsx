import Tilt from "./Tilt";

export default function Capabilities() {
  return (
    <section className="px-4 py-28 md:py-36">
      <div className="mx-auto max-w-6xl [perspective:1400px]">
        <div className="reveal mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-medium text-flame">What I do</p>
          <h2 className="flip-up font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-bold leading-[1.1]">
            One person, the full path from idea to launch.
          </h2>
        </div>

        {/* Bento with real visual variation and exact cell count */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:grid-rows-2">
          {/* Large feature cell with image */}
          <article className="reveal-3d group relative min-h-80 overflow-hidden rounded-[var(--radius-card)] hairline md:col-span-2 md:row-span-2">
            <img
              src="https://picsum.photos/seed/web-engineering-code/1100/900"
              alt="Code on a screen during a build"
              className="bento-img absolute inset-x-0 top-[-9%] h-[118%] w-full object-cover opacity-60"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
            <div className="absolute bottom-0 p-8">
              <h3 className="font-display text-2xl font-bold md:text-3xl">
                Web engineering
              </h3>
              <p className="mt-3 max-w-md text-bone-dim">
                Production React and Next.js apps with clean data layers, sane
                state, and pages that load before you notice. App Router, server
                components, and type-safe APIs end to end.
              </p>
            </div>
          </article>

          {/* Gradient cell */}
          <Tilt
            max={8}
            className="reveal-3d group flex flex-col justify-between rounded-[var(--radius-card)] p-7 hairline"
          >
            <div
              className="absolute inset-0 rounded-[inherit]"
              style={{
                background:
                  "radial-gradient(120% 120% at 100% 0%, rgba(255,74,36,0.22), transparent 60%), var(--color-surface)",
              }}
            />
            <span className="relative font-display text-3xl">📱</span>
            <div className="relative">
              <h3 className="font-display text-xl font-bold">Mobile apps</h3>
              <p className="mt-2 text-sm text-muted">
                Cross-platform apps with React Native and Expo, shipped to both
                stores from one codebase.
              </p>
            </div>
          </Tilt>

          {/* Solid surface cell */}
          <Tilt
            max={8}
            className="reveal-3d group flex flex-col justify-between rounded-[var(--radius-card)] bg-surface p-7 hairline"
          >
            <span className="relative font-display text-3xl">✺</span>
            <div className="relative">
              <h3 className="font-display text-xl font-bold">
                Design engineering
              </h3>
              <p className="mt-2 text-sm text-muted">
                Interfaces, motion, and design systems built in code, so the
                final product matches the intent.
              </p>
            </div>
          </Tilt>
        </div>
      </div>
    </section>
  );
}
