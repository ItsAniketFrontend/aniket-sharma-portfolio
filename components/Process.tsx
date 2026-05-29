const steps = [
  {
    n: "01",
    title: "Understand",
    body: "We get specific about the problem, the users, and what done actually looks like before any code happens.",
  },
  {
    n: "02",
    title: "Prototype",
    body: "A rough, clickable version early. Real interactions beat slide decks for finding what works.",
  },
  {
    n: "03",
    title: "Build",
    body: "Shipping in small slices you can try, with tests and reviews so nothing breaks quietly.",
  },
  {
    n: "04",
    title: "Refine",
    body: "Performance, accessibility, and the small details that make a product feel finished.",
  },
];

export default function Process() {
  return (
    <section id="process" className="px-4 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="reveal mb-14 max-w-xl">
          <p className="mb-4 text-sm font-medium text-flame">How I work</p>
          <h2 className="flip-up font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-bold leading-[1.1]">
            A simple loop, run carefully.
          </h2>
        </div>

        {/* Scrub-filled track that tracks scroll through the section */}
        <div className="reveal relative mb-8 h-[2px] w-full overflow-hidden rounded-full bg-line">
          <div className="process-line h-full w-full origin-left scale-x-0 bg-flame" />
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="reveal-3d group bg-ink p-8 transition-colors duration-300 hover:bg-surface"
            >
              <span className="font-display text-5xl font-extrabold text-surface-2 transition-colors duration-300 group-hover:text-flame">
                {s.n}
              </span>
              <h3 className="mt-6 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
