import type { Metadata } from 'next'
import { about, company, contact } from '@/content/site'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { RollText } from '@/components/ui/Button'
import { withAccent } from '@/components/ui/Accent'
import { ArrowUpRight } from '@/components/ui/icons'
import { CopyEmail } from '@/components/contact/CopyEmail'
import { ContactForm } from '@/components/contact/ContactForm'
import { OriginRadar } from '@/components/about/OriginRadar'

export const metadata: Metadata = {
  title: 'Contact',
  description: contact.copy,
  openGraph: { title: 'Contact | Zynara Tech', description: contact.copy },
}

export default function ContactPage() {
  return (
    <>
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section data-theme="light" className="relative isolate overflow-hidden bg-ice pt-36 pb-20 text-ink lg:pt-48 lg:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(55% 70% at 0% 0%, #ffffff, transparent 70%), radial-gradient(40% 60% at 100% 30%, rgb(34 195 255 / 0.3), transparent 70%), radial-gradient(35% 45% at 60% 100%, rgb(79 70 229 / 0.14), transparent 70%)',
          }}
        />
        <div className="shell">
          <Eyebrow tone="light" intro delay={0.15}>
            {contact.eyebrow}
          </Eyebrow>
          <h1 data-reveal="lines" data-intro data-delay="0.2" className="mt-8 max-w-[15ch] text-display text-ink">
            {withAccent(contact.title, 'Vaqto?')}
          </h1>

          <div className="mt-14 grid gap-10 border-t border-ink/10 pt-10 lg:mt-20 lg:grid-cols-12 lg:items-end">
            <p data-reveal="fade" data-intro data-delay="0.5" className="max-w-md text-lead text-muted lg:col-span-5">
              {contact.copy}
            </p>
            <div data-reveal="fade" data-intro data-delay="0.6" className="flex flex-col items-start gap-6 lg:col-span-7 lg:items-end">
              <a
                href={`mailto:${company.email}`}
                className="roll-trigger font-display text-[clamp(1.35rem,4.6vw,4.4rem)] leading-none font-medium tracking-[-0.045em]"
              >
                <RollText>{company.email}</RollText>
              </a>
              <CopyEmail email={company.email} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- Form & channels ----------------------------- */}
      <section data-theme="light" className="bg-paper py-24 text-ink lg:py-36">
        <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div data-reveal="fade" className="lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="lg:col-span-4 lg:col-start-9" aria-label="Contact channels">
            <ul data-reveal="stagger" className="border-b border-ink/10">
              {contact.channels.map((channel) => {
                const external = 'external' in channel && channel.external
                return (
                  <li key={channel.value} className="border-t border-ink/10">
                    <a
                      href={channel.href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="roll-trigger group flex items-start justify-between gap-6 py-6"
                    >
                      <span>
                        <span className="block text-sm leading-snug text-muted">{channel.label}</span>
                        <span className="mt-2 block font-display text-[1.3rem] font-medium tracking-[-0.03em] text-ink">
                          <RollText>{channel.value}</RollText>
                        </span>
                      </span>
                      <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-ink/15 transition-colors duration-500 group-hover:border-transparent group-hover:bg-ink group-hover:text-white">
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </aside>
        </div>
      </section>

      {/* -------------------------------- Location -------------------------------- */}
      <section data-theme="dark" className="relative isolate overflow-hidden bg-navy py-28 lg:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(40% 55% at 25% 50%, rgb(34 195 255 / 0.1), transparent 70%)' }}
        />
        <div className="shell grid items-center gap-14 lg:grid-cols-12">
          <div data-reveal="scale-in" className="order-last lg:order-first lg:col-span-6">
            <OriginRadar className="max-w-[460px]" />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Eyebrow>{about.origin.eyebrow}</Eyebrow>
            <h2 data-reveal="lines" className="mt-7 text-h2 text-white">
              {company.locationFull}
            </h2>
            <p data-reveal="fade" className="mt-7 max-w-md text-lead text-fog">
              {contact.copy}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
