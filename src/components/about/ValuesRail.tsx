'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { motionDisabled } from '@/lib/env'
import { ValueGlyph } from './ValueGlyph'

type Props = {
  eyebrow: string
  title: string
  intro: string
  items: readonly { title: string; copy: string }[]
}

/** Values as a pinned horizontal rail on desktop; a vertical stack elsewhere. */
export function ValuesRail({ eyebrow, title, intro, items }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (motionDisabled()) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const track = trackRef.current
        if (!track) return
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

        const rail = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(progressRef.current, { scaleX: self.progress }),
          },
        })

        gsap.utils.toArray<HTMLElement>('[data-panel]', track).forEach((panel) => {
          gsap.fromTo(
            panel.querySelectorAll('[data-panel-part]'),
            { opacity: 0.15, x: 60 },
            {
              opacity: 1,
              x: 0,
              stagger: 0.06,
              ease: 'none',
              scrollTrigger: { trigger: panel, containerAnimation: rail, start: 'left 95%', end: 'left 55%', scrub: true },
            },
          )
        })
      })

      mm.add('(max-width: 1023px)', () => {
        gsap.utils.toArray<HTMLElement>('[data-panel]', trackRef.current).forEach((panel) => {
          gsap.from(panel.querySelectorAll('[data-panel-part]'), {
            opacity: 0,
            y: 36,
            stagger: 0.08,
            duration: 1.2,
            scrollTrigger: { trigger: panel, start: 'top 85%', once: true },
          })
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} data-theme="dark" className="relative isolate overflow-hidden bg-ink lg:h-[100svh]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(45% 60% at 10% 100%, rgb(78 40 252 / 0.22), transparent 70%), radial-gradient(35% 45% at 95% 0%, rgb(34 195 255 / 0.1), transparent 70%)',
        }}
      />

      <div
        ref={trackRef}
        className="flex flex-col py-28 lg:h-full lg:w-max lg:flex-row lg:items-center lg:py-0 lg:pr-[8vw] lg:pl-[max(3.75rem,calc((100vw-1480px)/2+3.75rem))]"
      >
        <div className="shell shrink-0 lg:w-[40vw] lg:max-w-none lg:px-0 lg:pr-[6vw]">
          <p className="eyebrow text-glow">{eyebrow}</p>
          <h2 className="mt-7 text-h2 text-white">{title}</h2>
          <p className="mt-8 max-w-md text-lead text-fog">{intro}</p>
          <div className="mt-12 hidden items-center gap-4 lg:flex" aria-hidden="true">
            <span className="mono-label text-slate">01</span>
            <span className="relative block h-px w-40 overflow-hidden bg-white/15">
              <span ref={progressRef} className="bg-brand absolute inset-0 origin-left scale-x-0" />
            </span>
            <span className="mono-label text-slate">0{items.length}</span>
          </div>
        </div>

        <div className="shell mt-16 flex flex-col lg:mt-0 lg:w-auto lg:max-w-none lg:flex-row lg:px-0">
          {items.map((item, i) => (
            <article
              key={item.title}
              data-panel
              className="group flex shrink-0 flex-col justify-between gap-12 border-t border-white/10 py-12 lg:h-[64svh] lg:w-[30vw] lg:max-w-[460px] lg:min-w-[340px] lg:border-t-0 lg:border-l lg:px-[2.6vw] lg:py-2"
            >
              <div data-panel-part className="flex items-start justify-between">
                <ValueGlyph index={i} />
                <span className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-none font-medium tracking-[-0.06em] text-white/[0.07] transition-colors duration-700 group-hover:text-white/20">
                  0{i + 1}
                </span>
              </div>
              <div>
                <h3 data-panel-part className="text-h3 text-white">
                  {item.title}
                </h3>
                <p data-panel-part className="mt-4 max-w-xs leading-relaxed text-fog">
                  {item.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
