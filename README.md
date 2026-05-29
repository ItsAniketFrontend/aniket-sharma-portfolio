# Aniket Sharma, Portfolio

A modern portfolio for a web and app developer. Built with Next.js 16 (App Router),
Tailwind CSS v4, and GSAP, following the taste-skill anti-slop design framework.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Design decisions (taste-skill dials)

- **Design variance 7**: asymmetric hero split, varied section families, no repeated layouts.
- **Motion intensity 5**: load reveal, scroll-triggered fades, magnetic CTA, cursor-follow
  work preview. Transforms and opacity only. Wrapped in a reduced-motion guard.
- **Visual density 4**: spacious, editorial, generous whitespace.

### Palette (consistency locked)

Near-black ink, bone neutrals, and a single saturated vermilion accent (`#ff4a24`).
Deliberately rotated away from the AI-purple glow and the beige-craft defaults.
One accent, one corner-radius system, one theme.

### Typography

Cabinet Grotesk (display) and Satoshi (body) via Fontshare. Inter is not the baseline
and no serif is used by default.

### Layout families used

Asymmetric hero, single marquee, editorial two-column about, spotlight work list,
varied bento, stepped process grid, centered closing CTA. No three-equal-feature-cards,
no repeated zigzag, one contact intent site-wide.

## Structure

```
app/
  layout.tsx      fonts + metadata
  globals.css     design tokens, theme, keyframes
  page.tsx        assembly + GSAP orchestration
components/        Nav, Hero, Marquee, About, Work, Capabilities, Process, Contact, Footer, MagneticButton
```

## Editing the content

Project data lives in `components/Work.tsx`, stats in `components/About.tsx`,
process steps in `components/Process.tsx`, and links in `components/Footer.tsx`.
Swap the Picsum image seeds for real screenshots when you have them.
