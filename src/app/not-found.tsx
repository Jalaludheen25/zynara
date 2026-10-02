import type { Metadata } from 'next'
import { nav, notFound } from '@/content/site'
import { Button, RollText } from '@/components/ui/Button'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { NotFoundCode } from '@/components/layout/NotFoundCode'

export const metadata: Metadata = {
  title: { absolute: `${notFound.code}: ${notFound.title}` },
  robots: { index: false },
}

export default function NotFound() {
  return (
    <section data-theme="dark" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink pt-28 pb-16">
      {/* A route that simply runs out */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 -z-10 size-full"
        fill="none"
      >
        <defs>
          <linearGradient id="nf-route" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5a3bff" />
            <stop offset="0.6" stopColor="#22d0fc" />
            <stop offset="1" stopColor="#22d0fc" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-20 470 C 220 470, 300 380, 520 390 S 820 500, 1000 430"
          stroke="url(#nf-route)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 12px rgb(34 195 255 / 0.6))' }}
        />
        <path d="M1000 430 C 1080 400, 1150 380, 1240 390" stroke="rgb(255 255 255 / 0.25)" strokeWidth="2" strokeDasharray="3 12" strokeLinecap="round" />
        <circle cx="1000" cy="430" r="6" fill="#fff" />
        <circle cx="1000" cy="430" r="6" stroke="#7edfff" className="origin-center [animation:pulse-ring_2.4s_ease-out_infinite] [transform-box:fill-box]" />
      </svg>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgb(79 70 229 / 0.2), transparent 70%)' }}
      />

      <div className="shell">
        <p data-reveal="fade" data-intro className="eyebrow text-glow">
          Zynara Tech
        </p>
        <div data-reveal="scale-in" data-intro data-delay="0.1" className="mt-6">
          <NotFoundCode code={notFound.code} />
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h2 data-reveal="lines" data-intro data-delay="0.35" className="text-h2 text-white lg:col-span-6">
            {notFound.title}
          </h2>
          <div data-reveal="fade" data-intro data-delay="0.55" className="flex flex-col gap-8 lg:col-span-5 lg:col-start-8 lg:items-end">
            <Button href="/">Back to home</Button>
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-fog">
              {nav.map((item) => (
                <li key={item.href}>
                  <TransitionLink href={item.href} className="roll-trigger link-line inline-flex hover:text-white">
                    <RollText>{item.label}</RollText>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
