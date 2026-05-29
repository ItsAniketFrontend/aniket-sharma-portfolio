/*
  The one marquee on the page (taste-skill: max one). Logos only via Simple
  Icons, no category labels underneath.
*/
const stack = [
  { slug: "react", name: "React" },
  { slug: "nextdotjs", name: "Next.js" },
  { slug: "typescript", name: "TypeScript" },
  { slug: "tailwindcss", name: "Tailwind CSS" },
  { slug: "expo", name: "Expo" },
  { slug: "nodedotjs", name: "Node.js" },
  { slug: "postgresql", name: "PostgreSQL" },
  { slug: "prisma", name: "Prisma" },
  { slug: "figma", name: "Figma" },
  { slug: "vercel", name: "Vercel" },
];

export default function Marquee() {
  const row = [...stack, ...stack];
  return (
    <section
      aria-label="Tools and technologies"
      className="border-y border-line py-8"
    >
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="animate-marquee flex w-max items-center gap-16 pr-16">
          {row.map((t, i) => (
            <img
              key={`${t.slug}-${i}`}
              src={`https://cdn.simpleicons.org/${t.slug}/8a8a90`}
              alt={t.name}
              className="h-7 w-auto shrink-0 opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
