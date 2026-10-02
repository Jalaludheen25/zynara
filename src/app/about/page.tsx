import type { Metadata } from 'next'
import Image from 'next/image'
import aboutImage from '@/assets/images/zynara-about.jpg'
import vaqtoImage from '@/assets/images/vaqto-story.jpg'
import { about } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { withAccent } from '@/components/ui/Accent'
import { Check } from '@/components/ui/icons'
import { ValuesRail } from '@/components/about/ValuesRail'
import { OriginRadar } from '@/components/about/OriginRadar'
import { HoverPreview } from '@/components/about/HoverPreview'

export const metadata: Metadata = {
  title: 'About',
  description: about.hero.copy,
  openGraph: { title: 'About | Zynara Tech', description: about.hero.copy },
}

const SLICES = 5

export default function AboutPage() {
  const { hero, vision, mission, values, origin, next } = about

  return (
    <>
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section data-theme="light" className="relative overflow-hidden bg-paper pt-36 pb-8 text-ink lg:pt-48">
        <div className="shell">
          <Eyebrow tone="light" intro delay={0.15}>
            {hero.kicker}
          </Eyebrow>
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 data-reveal="lines" data-intro data-delay="0.2" className="text-display text-ink lg:col-span-8">
              <span className="block">{hero.titleLines[0]}</span>
              <span className="block">{withAccent(hero.titleLines[1], 'real life.')}</span>
            </h1>
            <p data-reveal="fade" data-intro data-delay="0.5" className="max-w-md text-lead text-muted lg:col-span-4 lg:pb-3">
              {hero.copy}
            </p>
          </div>
        </div>

        {/* Shutter reveal: the image arrives in vertical slices */}
        <div className="shell mt-14 lg:mt-20">
          <div className="relative h-[52svh] overflow-hidden rounded-[22px] bg-surface sm:h-[66svh] lg:h-[84svh] lg:rounded-[32px]">
            <div data-parallax="0.16" className="absolute inset-x-0 -inset-y-[9%]">
              {Array.from({ length: SLICES }, (_, i) => (
                <div
                  key={i}
                  data-reveal="image"
                  data-scale="1"
                  data-intro
                  data-delay={0.55 + i * 0.07}
                  className="absolute inset-y-0 overflow-hidden"
                  style={{ left: `${(i * 100) / SLICES}%`, width: `calc(${100 / SLICES}% + 1px)` }}
                >
                  <div
                    className="absolute inset-y-0"
                    style={{ width: `calc((100% - 1px) * ${SLICES})`, left: `calc((100% - 1px) * ${-i})` }}
                  >
                    <Image
                      src={aboutImage}
                      alt={i === 0 ? hero.imageAlt : ''}
                      aria-hidden={i === 0 ? undefined : true}
                      fill
                      preload={i === 0}
                      sizes="100vw"
                      placeholder="blur"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- Vision & mission ---------------------------- */}
      <section data-theme="light" className="bg-paper py-28 text-ink lg:py-44">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-3 lg:pt-4">
              <Eyebrow tone="light">{vision.eyebrow}</Eyebrow>
            </div>
            <h2 data-reveal="lines" className="text-h2 text-ink lg:col-span-9">
              {vision.title}
            </h2>
          </div>

          <span data-reveal="line" aria-hidden="true" className="my-20 block h-px bg-ink/12 lg:my-32" />

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-3 lg:pt-4">
              <Eyebrow tone="light">{mission.eyebrow}</Eyebrow>
            </div>
            <h2
              data-reveal="words-scrub"
              className="font-display text-[clamp(1.9rem,4vw,4.2rem)] leading-[1.08] font-medium tracking-[-0.045em] text-ink lg:col-span-9"
            >
              {mission.title}
            </h2>
          </div>
        </div>
      </section>

      <ValuesRail eyebrow={values.eyebrow} title={values.title} intro={values.intro} items={values.items} />

      {/* --------------------------------- Origin --------------------------------- */}
      <section data-theme="dark" className="relative isolate overflow-hidden bg-navy py-28 lg:py-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(40% 50% at 78% 50%, rgb(34 195 255 / 0.1), transparent 70%)' }}
        />
        <div className="shell grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Eyebrow>{origin.eyebrow}</Eyebrow>
            <h2 data-reveal="lines" className="mt-7 text-h2 text-white">
              <span className="block">{origin.titleLines[0]}</span>
              <span className="block">{withAccent(origin.titleLines[1], 'Grounded in the region.')}</span>
            </h2>
            <p data-reveal="fade" className="mt-8 max-w-lg text-[clamp(1.15rem,1.6vw,1.45rem)] leading-relaxed text-fog">
              {origin.copy}
            </p>
            <ul data-reveal="stagger" className="mt-12 max-w-lg border-b border-white/10">
              {origin.list.map((item, i) => (
                <li key={item} className="flex items-center justify-between gap-6 border-t border-white/10 py-5">
                  <span className="flex items-center gap-4 text-white">
                    <span className="bg-brand grid size-6 shrink-0 place-items-center rounded-full">
                      <Check className="size-3" />
                    </span>
                    {item}
                  </span>
                  <span className="font-mono text-xs text-slate">0{i + 1}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="scale-in" className="lg:col-span-6">
            <OriginRadar />
          </div>
        </div>
      </section>

      {/* ---------------------------------- Next ---------------------------------- */}
      <section data-theme="light" className="relative overflow-hidden bg-paper py-28 text-ink lg:py-44">
        <div className="shell">
          <Eyebrow tone="light">{next.eyebrow}</Eyebrow>
          <div className="mt-8">
            <HoverPreview href={next.cta.href} image={vaqtoImage} label={next.cta.label}>
              <h2 data-reveal="lines" className="max-w-[17ch] text-display text-ink transition-colors duration-500 group-hover:text-indigo">
                {withAccent(next.title, 'Vaqto.')}
              </h2>
            </HoverPreview>
          </div>
          <div data-reveal="fade" className="mt-12 flex items-center gap-6 border-t border-ink/10 pt-10">
            <Button href={next.cta.href} variant="dark">
              {next.cta.label}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
