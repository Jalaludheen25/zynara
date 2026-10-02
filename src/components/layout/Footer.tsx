import { company, footerColumns } from '@/content/site'
import { Logo } from '@/components/brand/Logo'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { RollText } from '@/components/ui/Button'
import { ArrowUpRight } from '@/components/ui/icons'
import { LocalTime } from '@/components/ui/LocalTime'
import { BackToTop } from './BackToTop'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer data-theme="dark" className="relative isolate overflow-hidden bg-ink pt-24 text-white lg:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%]"
        style={{
          background:
            'radial-gradient(55% 60% at 20% 100%, rgb(78 40 252 / 0.22), transparent 70%), radial-gradient(45% 55% at 85% 100%, rgb(34 195 255 / 0.14), transparent 70%)',
        }}
      />

      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <TransitionLink href="/" aria-label="Zynara Tech home" className="inline-block">
              <Logo />
            </TransitionLink>
            <p className="mt-6 max-w-sm text-[1.05rem] leading-relaxed text-fog">{company.tagline}</p>
            <a
              href={`mailto:${company.email}`}
              className="roll-trigger mt-10 inline-flex items-center gap-3 font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-medium tracking-[-0.04em]"
            >
              <RollText>{company.email}</RollText>
              <ArrowUpRight className="size-5 text-cyan" />
            </a>
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {footerColumns.map((column) => (
              <div key={column.label}>
                <p className="mono-label text-slate">{column.label}</p>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="roll-trigger inline-flex items-center gap-1.5 text-fog transition-colors hover:text-white"
                        >
                          <RollText>{link.label}</RollText>
                          <ArrowUpRight className="size-3.5" />
                        </a>
                      ) : (
                        <TransitionLink
                          href={link.href}
                          className="roll-trigger inline-flex text-fog transition-colors hover:text-white"
                        >
                          <RollText>{link.label}</RollText>
                        </TransitionLink>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-5 border-t border-white/10 py-7 text-sm text-slate sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Zynara Tech. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p>{company.locationFull}</p>
            <LocalTime className="mono-label text-fog" />
            <BackToTop />
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div data-reveal="image" className="relative select-none" aria-hidden="true">
        <p
          data-reveal-inner
          className="text-gradient origin-bottom text-center font-display text-[29vw] leading-[0.9] font-semibold tracking-[-0.075em] whitespace-nowrap"
        >
          Zynara
        </p>
      </div>
    </footer>
  )
}
