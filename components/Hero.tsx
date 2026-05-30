import MagneticButton from "./MagneticButton";
import HeroCanvas from "./HeroCanvas";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] items-center overflow-hidden px-4 pt-24"
    >
      {/* Soft radial wash, no neon glow */}
      <div
        aria-hidden
        data-speed="0.18"
        className="pointer-events-none absolute -top-1/3 right-[-10%] h-[70vh] w-[70vh] rounded-full opacity-[0.18] blur-[120px]"
        style={{ background: "var(--color-flame)" }}
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left: editorial copy */}
        <div className="hero-text">
          <span className="hero-rise inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            <span className="h-px w-8 bg-flame" />
            Web &amp; App Developer
          </span>

          <h1 className="hero-title mt-6 font-display text-[clamp(2.6rem,7vw,5.2rem)] font-extrabold leading-[0.98] text-balance">
            I design and ship web and app products people actually
            <span className="text-flame"> use</span>.
          </h1>

          <p className="hero-rise mt-7 max-w-md text-lg leading-relaxed text-bone-dim">
            Full-stack developer based in India, focused on React, Next.js and
            React Native. I turn rough ideas into shipped products.
          </p>

          <div className="hero-rise mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton href="#work">View work</MagneticButton>
            <MagneticButton href="#contact" variant="ghost">
              Get in touch
            </MagneticButton>
          </div>
        </div>

        {/* Right: interactive 3D brand object */}
        <div className="hero-rise hero-visual relative">
          <div className="relative h-[clamp(360px,56vh,580px)] w-full">
            <HeroCanvas />
          </div>
          <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex items-end justify-between px-1">
            <p className="text-sm text-muted">Say hi, it follows your cursor</p>
            <span className="rounded-[var(--radius-pill)] bg-ink/70 px-3 py-1 text-xs text-bone backdrop-blur hairline">
              Open to work
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
