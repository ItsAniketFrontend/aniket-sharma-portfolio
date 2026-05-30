import MagneticButton from "./MagneticButton";

export default function Contact() {
  return (
    <section id="contact" className="px-4 py-28 md:py-40">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="split-reveal font-display text-[clamp(2.4rem,7vw,5rem)] font-extrabold leading-[0.98] text-balance">
          Have something worth
          <span className="text-flame"> building</span>?
        </h2>
        <p className="reveal mx-auto mt-6 max-w-md text-lg text-bone-dim">
          I take on a couple of projects at a time. Tell me what you are working
          on and I will reply within a day.
        </p>

        <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href="mailto:aniketsharma.sh17@gmail.com">
            Get in touch
          </MagneticButton>
          <a
            href="mailto:aniketsharma.sh17@gmail.com"
            className="text-sm text-muted underline-offset-4 transition-colors hover:text-bone hover:underline"
          >
            aniketsharma.sh17@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
