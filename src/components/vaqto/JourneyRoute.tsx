'use client'

import { useRef, useState } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { motionDisabled } from '@/lib/env'

type Step = { title: string; copy: string }
type Props = { eyebrow: string; title: string; intro: string; steps: readonly Step[] }

// Route through four stops (viewBox 1200 × 200); each stop is a segment end.
const NODES = [
  { x: 150, y: 100 },
  { x: 450, y: 130 },
  { x: 750, y: 80 },
  { x: 1050, y: 115 },
]
const ROUTE =
  'M 0 110 C 60 110, 100 100, 150 100 C 260 100, 330 150, 450 130 C 570 110, 640 60, 750 80 C 870 100, 950 140, 1050 115 C 1110 102, 1160 95, 1200 95'

/**
 * Discover → Compare → Plan → Book. On desktop the section pins and the route
 * draws itself, lighting each stop in turn. On smaller screens it becomes a
 * vertical timeline that fills as you scroll.
 */
export function JourneyRoute({ eyebrow, title, intro, steps }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const headRef = useRef<HTMLSpanElement>(null)
  const railRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(-1)

  useGSAP(
    () => {
      const section = sectionRef.current
      const path = pathRef.current
      if (!section || !path) return

      if (motionDisabled()) {
        setActive(steps.length - 1)
        return
      }

      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const length = path.getTotalLength()
        // Fraction of the path length at which each stop is reached.
        const stops = NODES.map((node) => {
          let lo = 0
          let hi = length
          for (let i = 0; i < 24; i++) {
            const mid = (lo + hi) / 2
            if (path.getPointAtLength(mid).x < node.x) lo = mid
            else hi = mid
          }
          return lo / length
        })

        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        const state = { p: 0 }
        gsap.to(state, {
          p: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=240%',
            pin: true,
            scrub: 0.8,
          },
          onUpdate: () => {
            const drawn = state.p * length
            path.style.strokeDashoffset = String(length - drawn)
            const point = path.getPointAtLength(Math.max(0.01, drawn))
            if (headRef.current) {
              headRef.current.style.left = `${(point.x / 1200) * 100}%`
              headRef.current.style.top = `${(point.y / 200) * 100}%`
              headRef.current.style.opacity = state.p > 0.005 && state.p < 0.995 ? '1' : '0'
            }
            let reached = -1
            stops.forEach((stop, i) => {
              if (state.p >= stop - 0.004) reached = i
            })
            setActive(reached)
          },
        })
      })

      mm.add('(max-width: 1023px)', () => {
        gsap.fromTo(
          railRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: railRef.current?.parentElement, start: 'top 70%', end: 'bottom 70%', scrub: true },
          },
        )
        gsap.utils.toArray<HTMLElement>('[data-step]', section).forEach((el, i) => {
          // Opacity is driven by React state; GSAP only adds the slide-in.
          gsap.from(el, {
            x: 24,
            duration: 1.2,
            scrollTrigger: { trigger: el, start: 'top 72%', once: true, onEnter: () => setActive((a) => Math.max(a, i)) },
          })
        })
      })
    },
    { scope: sectionRef, dependencies: [steps.length] },
  )

  return (
    <section
      id="journey"
      ref={sectionRef}
      data-theme="dark"
      className="relative isolate overflow-hidden bg-ink py-28 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(50% 45% at 50% 70%, rgb(79 70 229 / 0.18), transparent 70%), radial-gradient(30% 40% at 90% 20%, rgb(34 195 255 / 0.08), transparent 70%)',
        }}
      />

      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-glow" data-reveal="fade">
              {eyebrow}
            </p>
            <h2 data-reveal="lines" className="mt-7 text-h2 text-white">
              {title}
            </h2>
          </div>
          <p data-reveal="fade" className="max-w-md text-lead text-fog lg:col-span-4 lg:col-start-9">
            {intro}
          </p>
        </div>

        {/* Desktop: horizontal route */}
        <div className="relative mt-14 hidden lg:block xl:mt-16" aria-hidden="true">
          <div className="relative h-[160px] xl:h-[190px]">
            <svg viewBox="0 0 1200 200" preserveAspectRatio="none" fill="none" className="absolute inset-0 size-full overflow-visible">
              <defs>
                <linearGradient id="journey-grad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5a3bff" />
                  <stop offset="1" stopColor="#22d0fc" />
                </linearGradient>
              </defs>
              <path d={ROUTE} stroke="rgb(255 255 255 / 0.1)" strokeWidth="2" strokeDasharray="2 8" vectorEffect="non-scaling-stroke" />
              <path
                ref={pathRef}
                d={ROUTE}
                stroke="url(#journey-grad)"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 10px rgb(34 195 255 / 0.6))' }}
              />
            </svg>
            <span
              ref={headRef}
              className="absolute -mt-2 -ml-2 size-4 rounded-full bg-white opacity-0 shadow-[0_0_30px_8px_rgb(34_195_255_/_0.7)]"
            />
            {NODES.map((node, i) => (
              <span
                key={node.x}
                className="absolute -mt-[13px] -ml-[13px] grid size-[26px] place-items-center rounded-full border transition-all duration-700"
                style={{
                  left: `${(node.x / 1200) * 100}%`,
                  top: `${(node.y / 200) * 100}%`,
                  borderColor: active >= i ? 'rgb(126 223 255 / 0.9)' : 'rgb(255 255 255 / 0.2)',
                  background: active >= i ? 'rgb(34 195 255 / 0.18)' : 'var(--color-ink)',
                  boxShadow: active >= i ? '0 0 28px rgb(34 195 255 / 0.55)' : 'none',
                }}
              >
                <span
                  className="size-2 rounded-full transition-colors duration-700"
                  style={{ background: active >= i ? '#fff' : 'rgb(255 255 255 / 0.3)' }}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Steps */}
        <ol className="relative mt-16 grid gap-0 lg:mt-10 lg:grid-cols-4 lg:items-start lg:gap-0">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-px bg-white/10 lg:hidden">
            <span ref={railRef} className="bg-brand absolute inset-0 origin-top" />
          </span>
          {steps.map((step, i) => (
            <li
              key={step.title}
              data-step
              className="relative pb-12 pl-12 transition-opacity duration-700 last:pb-0 lg:px-[1.2vw] lg:pb-0 lg:text-center"
              style={{ opacity: active >= i ? 1 : 0.32 }}
            >
              <span
                aria-hidden="true"
                className={`absolute top-1 left-0 grid size-[23px] place-items-center rounded-full border bg-ink transition-colors duration-700 lg:hidden ${active >= i ? 'border-glow' : 'border-white/20'}`}
              >
                <span className={`size-1.5 rounded-full ${active >= i ? 'bg-white' : 'bg-white/30'}`} />
              </span>
              <span className="font-mono text-xs tracking-[0.2em] text-glow">0{i + 1}</span>
              <h3 className="mt-3 font-display text-[clamp(1.45rem,1.9vw,1.9rem)] font-medium tracking-[-0.04em] text-white">
                {step.title}
              </h3>
              {/* A shared minimum height (3 lines on narrow desktops, 2 from xl) keeps all four steps aligned */}
              <p className="mt-3 text-[0.95rem] leading-relaxed text-fog lg:mx-auto lg:min-h-[4.875em] lg:max-w-[17.5rem] xl:min-h-[3.25em]">{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
