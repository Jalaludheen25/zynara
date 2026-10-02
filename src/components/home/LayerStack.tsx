'use client'

import { useRef, useState } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { hasFinePointer, motionDisabled } from '@/lib/env'

type Item = { title: string; copy: string }

/*
  "Thoughtful on the surface. Disciplined underneath." — three isometric
  planes that separate as you scroll, exposing the layers beneath the surface.
*/

const PLATE_STYLES = [
  // Surface: calm, luminous
  'bg-[radial-gradient(120%_120%_at_20%_10%,rgb(126_223_255_/_0.32),rgb(79_70_229_/_0.18)_45%,rgb(8_13_27_/_0.4)_100%)] border-glow/40',
  // Structure: grid
  'bg-[linear-gradient(rgb(126_223_255_/_0.14)_1px,transparent_1px),linear-gradient(90deg,rgb(126_223_255_/_0.14)_1px,transparent_1px)] [background-size:22px_22px] bg-graphite/70 border-cyan/30',
  // Foundations: dense, violet
  'bg-[radial-gradient(rgb(90_59_255_/_0.55)_1px,transparent_1.4px)] [background-size:12px_12px] bg-navy/90 border-violet/50',
]

export function LayerStack({ items }: { items: readonly Item[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const root = rootRef.current
      const stack = stackRef.current
      if (!root || !stack) return
      const plates = gsap.utils.toArray<HTMLElement>('[data-plate]', root)

      // GSAP owns the transforms from here (no lossy matrix parsing).
      gsap.set(stack, { clearProps: 'transform' })
      gsap.set(stack, { rotateX: 58, rotateZ: -40 })
      gsap.set(plates, { clearProps: 'transform' })

      if (motionDisabled()) {
        plates.forEach((plate, i) => gsap.set(plate, { z: (1 - i) * 90 }))
        return
      }

      plates.forEach((plate, i) => gsap.set(plate, { z: (1 - i) * 20 }))
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 78%',
            end: 'bottom 45%',
            scrub: 0.8,
            onUpdate: (self) => setActive(Math.min(items.length - 1, Math.floor(self.progress * items.length * 0.999))),
          },
        })
        .to(plates, { z: (i: number) => (1 - i) * 88, ease: 'power2.inOut' }, 0)
        .fromTo(stack, { rotateZ: -44 }, { rotateZ: -34, ease: 'none' }, 0)

      if (!hasFinePointer()) return
      const tiltX = gsap.quickTo(stack, 'rotateX', { duration: 1, ease: 'power3' })
      const tiltY = gsap.quickTo(stack, 'rotateY', { duration: 1, ease: 'power3' })
      const onMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width - 0.5
        const py = (event.clientY - rect.top) / rect.height - 0.5
        tiltX(58 - py * 10)
        tiltY(px * 10)
      }
      const onLeave = () => {
        tiltX(58)
        tiltY(0)
      }
      root.addEventListener('pointermove', onMove)
      root.addEventListener('pointerleave', onLeave)
      return () => {
        root.removeEventListener('pointermove', onMove)
        root.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: rootRef, dependencies: [items.length] },
  )

  return (
    <div ref={rootRef} className="mt-20 grid items-center gap-14 lg:mt-28 lg:grid-cols-12 lg:gap-10">
      <div className="relative h-[360px] [perspective:2600px] sm:h-[480px] lg:col-span-7 lg:h-[580px]" aria-hidden="true">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(45% 45% at 50% 55%, rgb(79 70 229 / 0.28), transparent 70%)' }}
        />
        <div
          ref={stackRef}
          className="absolute inset-x-0 top-[16%] bottom-0 m-auto size-[min(54vw,320px)] [transform-style:preserve-3d] lg:size-[350px]"
          style={{ transform: 'rotateX(58deg) rotateZ(-40deg)' }}
        >
          {items.map((item, i) => (
            <div
              key={item.title}
              data-plate
              className={`absolute inset-0 rounded-[28px] border backdrop-blur-[2px] transition-[box-shadow,opacity] duration-700 ${PLATE_STYLES[i]} ${
                active === i ? 'opacity-100 shadow-[0_0_80px_-10px_rgb(34_195_255_/_0.55)]' : 'opacity-75'
              }`}
              style={{ transform: `translateZ(${(1 - i) * 20}px)` }}
            >
              <span className="mono-label absolute top-5 left-6 text-[0.62rem] text-white/80">
                0{i + 1} — {item.title}
              </span>
              {i === 0 && (
                <svg viewBox="0 0 100 100" className="absolute inset-[18%] opacity-80" fill="none">
                  <path
                    d="M8 80 C 30 78, 34 52, 52 50 S 78 30, 92 18"
                    stroke="url(#stack-route)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <circle cx="92" cy="18" r="3.2" fill="#7edfff" />
                  <defs>
                    <linearGradient id="stack-route" x1="0" y1="1" x2="1" y2="0">
                      <stop stopColor="#4e28fc" />
                      <stop offset="1" stopColor="#22d0fc" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      <ol className="lg:col-span-5">
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-pressed={active === i}
              className={`group relative grid w-full grid-cols-[3rem_1fr] gap-y-3 border-t border-white/10 py-8 text-left transition-opacity duration-500 ${
                active === i ? 'opacity-100' : 'opacity-45 hover:opacity-80'
              }`}
            >
              <span
                className={`bg-brand absolute top-[-1px] left-0 h-px transition-[width] duration-1000 ease-[var(--ease-expo)] ${active === i ? 'w-full' : 'w-0'}`}
              />
              <span className="pt-1.5 font-mono text-xs text-glow">0{i + 1}</span>
              <h3 className="text-h3 text-white">{item.title}</h3>
              <p className="col-start-2 max-w-sm leading-relaxed text-fog">{item.copy}</p>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
