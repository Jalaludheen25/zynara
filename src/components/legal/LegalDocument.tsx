import type { LegalDoc } from '@/content/site'
import { company } from '@/content/site'
import { LogoMark } from '@/components/brand/Logo'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { RollText } from '@/components/ui/Button'
import { ArrowRight } from '@/components/ui/icons'
import { LegalToc } from './LegalToc'

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

type Related = { label: string; href: string }

export function LegalDocument({ doc, related }: { doc: LegalDoc; related: Related[] }) {
  const sections = doc.sections.map((section) => ({ ...section, id: slug(section.title) }))

  return (
    <>
      <section data-theme="light" className="relative isolate overflow-hidden bg-paper pt-36 pb-16 text-ink lg:pt-48 lg:pb-24">
        <LogoMark className="pointer-events-none absolute top-24 -right-[8vw] -z-10 w-[min(70vw,760px)] opacity-[0.05]" />
        <div className="shell">
          <Eyebrow tone="light" intro delay={0.15}>
            {doc.eyebrow}
          </Eyebrow>
          <h1 data-reveal="lines" data-intro data-delay="0.2" className="mt-8 max-w-[12ch] text-display text-ink">
            {doc.title}
          </h1>
          <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
            <p
              data-reveal="fade"
              data-intro
              data-delay="0.45"
              className="mono-label inline-flex w-fit items-center gap-2.5 rounded-full border border-ink/12 bg-white px-4 py-2.5 text-[0.62rem] whitespace-nowrap text-muted lg:col-span-4"
            >
              <span className="size-1.5 rounded-full bg-indigo" aria-hidden="true" />
              {doc.updated}
            </p>
            <p data-reveal="fade" data-intro data-delay="0.55" className="max-w-3xl text-lead text-muted lg:col-span-7 lg:col-start-6">
              {doc.intro}
            </p>
          </div>
        </div>
      </section>

      <section data-theme="light" className="bg-paper pb-28 text-ink lg:pb-40">
        <div className="shell grid gap-14 border-t border-ink/10 pt-14 lg:grid-cols-12 lg:gap-8 lg:pt-20">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <LegalToc items={sections.map(({ id, title }) => ({ id, title }))} />
            </div>
          </aside>

          <article className="lg:col-span-8 lg:col-start-5">
            {sections.map((section, i) => (
              <section key={section.id} id={section.id} className="scroll-mt-28 border-b border-ink/10 pb-14 not-first:pt-14 last:border-0">
                <div data-reveal="fade" className="grid gap-4 sm:grid-cols-[4.5rem_1fr]">
                  <span className="font-display text-[2rem] leading-none font-medium tracking-[-0.06em] text-ink/15">
                    0{i + 1}
                  </span>
                  <div>
                    <h2 className="text-h3 text-ink">{section.title}</h2>
                    <p className="mt-5 text-[1.075rem] leading-[1.8] text-muted">
                      {section.body}
                      {section.email && (
                        <>
                          {' '}
                          <a href={`mailto:${section.email}`} className="link-line font-medium text-ink">
                            {section.email}
                          </a>
                          .
                        </>
                      )}
                      {section.after && <> {section.after}</>}
                    </p>
                  </div>
                </div>
              </section>
            ))}

            <div data-reveal="fade" className="mt-16 grid gap-3 sm:grid-cols-2">
              {related.map((link) => (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  className="roll-trigger group flex items-center justify-between rounded-2xl border border-ink/10 bg-white px-6 py-5 transition-colors duration-500 hover:border-ink"
                >
                  <span className="font-display text-lg font-medium tracking-[-0.03em]">
                    <RollText>{link.label}</RollText>
                  </span>
                  <span className="grid size-9 place-items-center rounded-full bg-ink text-white transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-rotate-45">
                    <ArrowRight className="size-3.5" />
                  </span>
                </TransitionLink>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted">
              {company.name} · {company.locationFull}
            </p>
          </article>
        </div>
      </section>
    </>
  )
}
