import { company, home } from '@/content/site'
import { Button, RollText } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ArrowUpRight } from '@/components/ui/icons'
import { withAccent } from '@/components/ui/Accent'

export function ContactCta() {
  const { eyebrow, title, copy } = home.contact
  return (
    <section data-theme="light" className="relative isolate overflow-hidden bg-ice py-28 text-ink lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(50% 70% at 0% 0%, #ffffff, transparent 70%), radial-gradient(45% 60% at 100% 100%, rgb(34 195 255 / 0.28), transparent 70%), radial-gradient(35% 45% at 70% 10%, rgb(79 70 229 / 0.12), transparent 70%)',
        }}
      />
      <div className="shell">
        <Eyebrow tone="light">{eyebrow}</Eyebrow>
        <h2 data-reveal="lines" className="mt-7 max-w-[15ch] text-display text-ink">
          {withAccent(title, 'Vaqto?')}
        </h2>

        <div className="mt-14 grid gap-10 border-t border-ink/10 pt-10 lg:mt-20 lg:grid-cols-12 lg:items-end">
          <p data-reveal="fade" className="max-w-md text-lead text-muted lg:col-span-5">
            {copy}
          </p>
          <div data-reveal="fade" data-delay="0.1" className="flex flex-col items-start gap-8 lg:col-span-7 lg:items-end">
            <a
              href={`mailto:${company.email}`}
              className="roll-trigger group inline-flex items-center gap-4 font-display text-[clamp(1.35rem,4.6vw,4.4rem)] leading-none font-medium tracking-[-0.045em]"
            >
              <RollText>{company.email}</RollText>
              <span className="grid size-[0.9em] shrink-0 place-items-center rounded-full bg-ink text-white transition-transform duration-700 ease-[var(--ease-expo)] group-hover:rotate-45">
                <ArrowUpRight className="size-[0.4em]" />
              </span>
            </a>
            <Button href="/contact" variant="dark">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
