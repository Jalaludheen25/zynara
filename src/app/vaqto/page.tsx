import type { Metadata } from 'next'
import Image from 'next/image'
import vaqtoImage from '@/assets/images/vaqto-story.jpg'
import aboutImage from '@/assets/images/zynara-about.jpg'
import { vaqto } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Marquee } from '@/components/ui/Marquee'
import { withAccent } from '@/components/ui/Accent'
import { Info } from '@/components/ui/icons'
import { TiltCard } from '@/components/vaqto/TiltCard'
import { JourneyRoute } from '@/components/vaqto/JourneyRoute'
import { AudiencePanels } from '@/components/vaqto/AudiencePanels'

export const metadata: Metadata = {
  title: 'Vaqto',
  description: vaqto.hero.copy,
  openGraph: { title: 'Vaqto | Zynara Tech', description: vaqto.hero.copy },
}

export default function VaqtoPage() {
  const { hero, problem, journey, route, audience, next } = vaqto
  const journeyWords = journey.steps.map((step) => step.title)

  return (
    <>
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section data-theme="dark" className="relative isolate overflow-hidden bg-ink pt-32 pb-20 lg:flex lg:min-h-[100svh] lg:items-center lg:pt-28 lg:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(45% 55% at 80% 45%, rgb(79 70 229 / 0.26), transparent 70%), radial-gradient(35% 40% at 10% 90%, rgb(34 195 255 / 0.1), transparent 70%)',
          }}
        />
        <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Eyebrow intro delay={0.15}>
              {hero.kicker}
            </Eyebrow>
            <h1
              data-reveal="lines"
              data-intro
              data-delay="0.2"
              className="mt-7 font-display text-[clamp(2.35rem,5.3vw,6.25rem)] leading-[0.98] font-medium tracking-[-0.05em] text-white"
            >
              <span className="block">{hero.titleLines[0]}</span>
              <span className="block">{withAccent(hero.titleLines[1], 'your car.')}</span>
            </h1>
            <p data-reveal="fade" data-intro data-delay="0.5" className="mt-8 max-w-[33rem] text-lead text-fog">
              {hero.copy}
            </p>
            <div data-reveal="fade" data-intro data-delay="0.65" className="mt-10 flex flex-wrap gap-3">
              <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
              <Button href={hero.secondaryCta.href} variant="ghost">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 lg:pl-6">
            <TiltCard className="rounded-[30px]">
              <div
                data-reveal="image"
                data-intro
                data-delay="0.35"
                className="relative aspect-[4/5] overflow-hidden rounded-[30px] bg-graphite sm:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/6]"
              >
                <Image
                  src={vaqtoImage}
                  alt={hero.imageAlt}
                  fill
                  preload
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  placeholder="blur"
                  className="object-cover object-[32%_center]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <ul className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2" aria-label={journey.title}>
                  {journeyWords.map((word, i) => (
                    <li
                      key={word}
                      className="mono-label flex items-center gap-2 rounded-full border border-white/20 bg-ink/45 px-3.5 py-2 text-[0.64rem] text-white backdrop-blur-md"
                    >
                      <span className="text-glow">0{i + 1}</span>
                      {word}
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* -------------------------------- Problem --------------------------------- */}
      <section data-theme="light" className="bg-paper py-28 text-ink lg:py-44">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Eyebrow tone="light">{problem.eyebrow}</Eyebrow>
              <h2 data-reveal="lines" className="mt-7 text-h2 text-ink">
                {problem.title}
              </h2>
            </div>
          </div>
          <div className="lg:col-span-8 lg:pl-8">
            <ul className="space-y-3 lg:space-y-5">
              {problem.questions.map((question, i) => (
                <li key={question} className="flex items-baseline gap-5 lg:gap-8">
                  <span className="shrink-0 font-mono text-xs text-indigo">0{i + 1}</span>
                  <p
                    data-reveal="words-scrub"
                    className="font-display text-[clamp(1.9rem,5vw,5.2rem)] leading-[1.04] font-medium tracking-[-0.05em] text-ink"
                  >
                    {question}
                  </p>
                </li>
              ))}
            </ul>
            <div data-reveal="fade" className="mt-16 flex gap-5 border-t border-ink/10 pt-10 lg:mt-24 lg:gap-8 lg:pl-[calc(0.75rem+2rem)]">
              <span aria-hidden="true" className="bg-brand mt-2 block h-14 w-1 shrink-0 rounded-full" />
              <p className="max-w-xl text-[clamp(1.2rem,1.8vw,1.6rem)] leading-snug tracking-[-0.02em] text-ink">{problem.answer}</p>
            </div>
          </div>
        </div>
      </section>

      <JourneyRoute eyebrow={journey.eyebrow} title={journey.title} intro={journey.intro} steps={journey.steps} />

      {/* --------------------------------- Route ---------------------------------- */}
      <section data-theme="light" className="relative overflow-hidden bg-paper py-28 text-ink lg:py-40">
        <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div data-reveal="image" className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface lg:col-span-7">
            <div data-parallax="0.14" className="absolute inset-x-0 -inset-y-[8%]">
              <Image src={aboutImage} alt={route.imageAlt} fill sizes="(min-width: 1024px) 58vw, 100vw" placeholder="blur" className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-5 lg:pl-6">
            <Eyebrow tone="light">{route.eyebrow}</Eyebrow>
            <h2 data-reveal="lines" className="mt-7 text-h2 text-ink">
              {withAccent(route.title, 'route ahead.')}
            </h2>
            <p data-reveal="fade" className="mt-7 text-lead text-muted">
              {route.copy}
            </p>
            <p data-reveal="fade" className="mt-10 flex gap-3 rounded-2xl border border-ink/10 bg-white/70 p-5 text-sm leading-relaxed text-muted">
              <Info className="mt-0.5 size-4 shrink-0 text-indigo" />
              {route.note}
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------- Audience -------------------------------- */}
      <section data-theme="dark" className="relative bg-ink py-28 lg:py-44">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Eyebrow>{audience.eyebrow}</Eyebrow>
              <h2 data-reveal="lines" className="mt-7 max-w-[18ch] text-h2 text-white">
                {audience.title}
              </h2>
            </div>
          </div>
          <div data-reveal="fade">
            <AudiencePanels items={audience.items} />
          </div>
        </div>
      </section>

      {/* ---------------------------------- Next ---------------------------------- */}
      <section data-theme="dark" className="bg-brand relative isolate overflow-hidden py-28 text-white lg:py-40">
        <Marquee
          items={journeyWords}
          duration={30}
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 translate-y-[30%] font-display text-[clamp(6rem,18vw,18rem)] leading-none font-semibold tracking-[-0.06em] whitespace-nowrap text-white/[0.08]"
        />
        <div className="shell flex flex-col items-center text-center">
          <Eyebrow tone="plain" className="[&::before]:[background:white]">
            {next.eyebrow}
          </Eyebrow>
          <h2 data-reveal="lines" className="mt-8 max-w-[16ch] text-display">
            {next.title}
          </h2>
          <div data-reveal="fade" className="mt-12">
            <Button href={next.cta.href}>{next.cta.label}</Button>
          </div>
        </div>
      </section>
    </>
  )
}
