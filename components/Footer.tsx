const socials = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X", href: "https://x.com" },
  { label: "Read.cv", href: "https://read.cv" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <a href="#top" className="font-display text-xl font-extrabold">
            Aniket<span className="text-flame">.</span>
          </a>
          <p className="mt-2 text-sm text-muted">
            Web and app developer. Building from India, working everywhere.
          </p>
        </div>

        <ul className="flex flex-wrap gap-6">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted transition-colors hover:text-flame"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-surface-2">
        Designed and built by Aniket Sharma, 2026.
      </p>
    </footer>
  );
}
