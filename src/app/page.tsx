import Image from 'next/image'
import vaqtoImage from '@/assets/images/vaqto-story.jpg'
import { home } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ScrollCue } from '@/components/ui/ScrollCue'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { withAccent } from '@/components/ui/Accent'
import { Check } from '@/components/ui/icons'
import { HeroVisual } from '@/components/home/HeroVisual'
import { CinematicBand } from '@/components/home/CinematicBand'
import { LayerStack } from '@/components/home/LayerStack'
import { ContactCta } from '@/components/home/ContactCta'

export default function HomePage() {
  const { hero, purpose, principles, product, standard } = home

  return (
    <>
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section data-theme="dark" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink">
        <HeroVisual alt={hero.imageAlt} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(8_13_27/0.15)_0%,rgb(8_13_27/0.55)_50%,rgb(8_13_27/0.96)_100%)] md:bg-[linear-gradient(90deg,rgb(8_13_27/0.94)_0%,rgb(8_13_27/0.62)_40%,rgb(8_13_27/0)_72%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

        <div className="shell relative z-10 flex flex-1 flex-col justify-end pt-32 pb-12 md:justify-center md:pb-20">
          <Eyebrow intro delay={0.15}>
            {hero.kicker}
          </Eyebrow>
          <h1 data-reveal="lines" data-intro data-delay="0.2" className="mt-7 text-display text-white md:max-w-[12ch]">
            <span className="block">{hero.titleLines[0]}</span>
            <span className="block">{withAccent(hero.titleLines[1], 'time back.')}</span>
          </h1>
          <p data-reveal="fade" data-intro data-delay="0.55" className="mt-8 max-w-[34rem] text-lead text-fog">
            {hero.copy}
          </p>
          <div data-reveal="fade" data-intro data-delay="0.7" className="mt-10 flex flex-wrap gap-3">
            <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
            <Button href={hero.secondaryCta.href} variant="ghost">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>

        <div
          data-reveal="fade"
          data-intro
          data-delay="0.9"
          className="shell relative z-10 flex items-end justify-between gap-6 pb-8 text-slate"
        >
          <ul className="mono-label flex flex-wrap gap-x-7 gap-y-2">
            {hero.foot.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="size-1 rounded-full bg-cyan" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <ScrollCue className="hidden sm:flex" />
        </div>
      </section>

      {/* -------------------------------- Purpose --------------------------------- */}
      <section data-theme="dark" className="relative bg-ink pt-28 pb-24 lg:pt-44 lg:pb-36">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Eyebrow>{purpose.eyebrow}</Eyebrow>
          </div>
          <div className="lg:col-span-9">
            <h2
              data-reveal="words-scrub"
              className="font-display text-[clamp(1.85rem,4vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.05em] text-white"
            >
              {purpose.title}
            </h2>
            <div className="mt-14 grid md:grid-cols-9 lg:mt-20">
              <span data-reveal="line" className="bg-brand mb-8 block h-px w-24 md:col-span-9" aria-hidden="true" />
              <p data-reveal="fade" className="text-lead text-fog md:col-span-6 md:col-start-4">
                {purpose.copy}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CinematicBand alt={hero.imageAlt} />

      {/* ------------------------------- Principles ------------------------------- */}
      <section data-theme="light" className="relative bg-paper py-28 text-text lg:py-44">
        <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Eyebrow tone="light">{principles.eyebrow}</Eyebrow>
              <h2 data-reveal="lines" className="mt-7 text-h2 text-ink">
                {principles.title}
              </h2>
              <p data-reveal="fade" className="mt-8 max-w-md text-lead text-muted">
                {principles.intro}
              </p>
            </div>
          </div>

          <ol className="lg:col-span-6 lg:col-start-7">
            {principles.items.map((item, i) => (
              <li key={item.title} className="group relative py-10 lg:py-14">
                <span data-reveal="line" className="absolute inset-x-0 top-0 h-px bg-ink/15" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="bg-brand absolute top-0 left-0 h-px w-0 transition-[width] duration-1000 ease-[var(--ease-expo)] group-hover:w-full"
                />
                <div data-reveal="fade" className="grid grid-cols-[3rem_1fr] gap-y-4 sm:grid-cols-[4.5rem_1fr]">
                  <span className="font-display text-[2rem] leading-none font-medium tracking-[-0.06em] text-ink/15 transition-colors duration-700 group-hover:text-indigo sm:text-[2.5rem]">
                    0{i + 1}
                  </span>
                  <h3 className="self-end text-h3 text-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-2">
                    {item.title}
                  </h3>
                  <p className="col-start-2 max-w-md text-[1.05rem] leading-relaxed text-muted">{item.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -------------------------------- Product --------------------------------- */}
      <section data-theme="light" className="relative overflow-hidden bg-paper pt-8 pb-28 text-text lg:pt-12 lg:pb-40">
        <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <TransitionLink
            href={product.primaryCta.href}
            aria-label={product.primaryCta.label}
            data-cursor-label="View"
            data-reveal="image"
            className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] bg-surface sm:aspect-[16/12] lg:col-span-7"
          >
            <div data-parallax="0.14" className="absolute inset-x-0 -inset-y-[8%]">
              <Image
                src={vaqtoImage}
                alt={product.imageAlt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                placeholder="blur"
                className="object-cover object-[30%_center] transition-transform duration-[1.6s] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
              />
            </div>
            <span className="mono-label absolute top-5 left-5 flex items-center gap-3 rounded-full bg-white/85 px-4 py-2.5 text-ink backdrop-blur-md">
              <span className="text-indigo">{product.tagIndex}</span>
              {product.tag}
            </span>
          </TransitionLink>

          <div className="lg:col-span-5 lg:pl-8">
            <Eyebrow tone="light">{product.eyebrow}</Eyebrow>
            <h2 data-reveal="lines" className="mt-7 text-h2 text-ink">
              {withAccent(product.title, 'better timed.')}
            </h2>
            <p data-reveal="fade" className="mt-7 text-lead text-muted">
              {product.copy}
            </p>
            <ul data-reveal="stagger" className="mt-10 border-b border-ink/10">
              {product.list.map((item) => (
                <li key={item} className="flex items-center gap-4 border-t border-ink/10 py-4 text-[1.02rem] text-ink">
                  <span className="bg-brand grid size-6 shrink-0 place-items-center rounded-full text-white">
                    <Check className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div data-reveal="fade" className="mt-10 flex flex-wrap gap-3">
              <Button href={product.primaryCta.href} variant="dark">
                {product.primaryCta.label}
              </Button>
              <Button href={product.secondaryCta.href} variant="outline">
                {product.secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------- Standard -------------------------------- */}
      <section data-theme="dark" className="relative isolate overflow-hidden bg-navy py-28 lg:py-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(50% 40% at 85% 0%, rgb(34 195 255 / 0.1), transparent 70%), radial-gradient(40% 50% at 0% 100%, rgb(78 40 252 / 0.16), transparent 70%)',
          }}
        />
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{standard.eyebrow}</Eyebrow>
              <h2 data-reveal="lines" className="mt-7 text-h2 text-white">
                {withAccent(standard.title, 'Disciplined underneath.')}
              </h2>
            </div>
            <p data-reveal="fade" className="max-w-md text-lead text-fog lg:col-span-4 lg:col-start-9">
              {standard.intro}
            </p>
          </div>
          <LayerStack items={standard.items} />
        </div>
      </section>

      <ContactCta />
    </>
  )
}
