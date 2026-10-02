# Zynara Tech — website

A seven-page rebuild of the Zynara Tech corporate site. All copy and contact details
come from the original site. The design is new: premium, motion-led, and built around
the Zynara route mark and its indigo → cyan palette.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4**: brand tokens and fluid type live in `src/app/globals.css`
- **GSAP 3** + ScrollTrigger + SplitText: scroll and text animation
- **Lenis**: smooth scrolling, driven by the GSAP ticker
- **Framer Motion** (`motion`): mobile menu and contact-form states, loaded only where used
- **three.js / React Three Fiber**: the home hero's interactive city, lazy-loaded after first paint

## Scripts

```bash
npm install
npm run dev              # http://localhost:3000
npm run build && npm start
npm run lint             # type-check
npm run optimize-images  # regenerate web images from /assets-source
```

Set `NEXT_PUBLIC_SITE_URL` for canonical URLs, the sitemap and Open Graph (default `https://zynaratech.co`).

## Pages

| Route      | Highlights                                                                          |
| ---------- | ----------------------------------------------------------------------------------- |
| `/`        | 3D city hero with a light route, scroll-filled statement, expanding cinematic image, 3D layer stack |
| `/about`   | Shutter-sliced hero image, pinned horizontal values rail, Dubai radar, hover-preview CTA |
| `/vaqto`   | Tilt card hero, scroll-highlighted questions, pinned journey route that draws itself, expanding audience panels |
| `/contact` | Enquiry composer (opens the visitor's email app; nothing is stored), contact channels, location |
| `/privacy` | Legal template with sticky contents, scroll-spy and reading progress               |
| `/terms`   | Same legal template                                                                 |
| 404        | Layered parallax error code                                                         |

The original site had five routes plus a contact section on the home page and a 404 page.
Contact became its own page, and the 404 page was redesigned, to make seven.

## Project structure

```
src/
  app/                 routes, metadata, icons, sitemap/robots, global CSS
  content/site.ts      ALL website copy — edit text here
  components/
    layout/            header, footer, page-transition curtain, smooth scroll, cursor, reveal engine
    ui/                buttons (magnetic + rolling labels), links, icons, marquee
    home/ about/ vaqto/ contact/ legal/   page-specific sections
  lib/                 GSAP registration, scroll + motion helpers
assets-source/         original brand PNGs (not served)
scripts/               image optimisation
```

## Motion system

Most sections are server components. They opt in to animation with data attributes,
which `components/layout/PageAnimations.tsx` reads on every navigation:

| Attribute                   | Effect                                           |
| --------------------------- | ------------------------------------------------ |
| `data-reveal="lines"`       | masked line-by-line text reveal                  |
| `data-reveal="words-scrub"` | words brighten as the element scrolls through    |
| `data-reveal="fade"` / `"stagger"` | fade + rise (children in sequence)        |
| `data-reveal="image"`       | clip-path wipe with the media settling in scale  |
| `data-reveal="line"` / `"scale-in"` | hairline draw / soft scale               |
| `data-parallax="0.15"`      | scrubbed vertical drift                          |
| `data-intro`, `data-delay`  | play when the page is uncovered / delay in seconds |

Safeguards:

- **Reduced motion:** honoured everywhere. There's no curtain or smooth scrolling, the 3D renders a single still frame, and all content shows immediately.
- **No JavaScript:** content is never hidden. Pre-animation states apply only after an inline script confirms JS is running, and a watchdog reveals everything if motion fails to start.
- **Desktop-only effects:** the custom cursor and magnetic buttons need a fine pointer. Pinned sections become simple stacked layouts below 1024px.
- **Hero 3D:** pauses when off-screen or when the tab is hidden, caps the pixel ratio, and falls back to the original hero artwork when WebGL2 is unavailable.

## Content notes

- The Privacy and Terms pages keep the original "Draft for legal review · September 2026" status and wording. Their final versions still need legal sign-off.
- Contact addresses: `hello@`, `privacy@` and `legal@zynaratech.co`; Vaqto links to `https://vaqto.co`.
