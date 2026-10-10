'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { hasFinePointer, prefersReducedMotion } from '@/lib/env'

/** Oversized error code built from layered outlines that drift with the pointer. */
export function NotFoundCode({ code }: { code: string }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const layers = Array.from(el.querySelectorAll<HTMLElement>('[data-depth]')).map((layer) => ({
      depth: parseFloat(layer.dataset.depth ?? '0'),
      x: gsap.quickTo(layer, 'x', { duration: 1.2, ease: 'power3' }),
      y: gsap.quickTo(layer, 'y', { duration: 1.2, ease: 'power3' }),
    }))

    const apply = (px: number, py: number) =>
      layers.forEach((layer) => {
        layer.x(px * layer.depth * window.innerWidth)
        layer.y(py * layer.depth * window.innerHeight)
      })

    if (!hasFinePointer()) {
      // Touch: a slow ambient drift instead of pointer parallax.
      const state = { t: 0 }
      const tween = gsap.to(state, {
        t: Math.PI * 2,
        duration: 9,
        repeat: -1,
        ease: 'none',
        onUpdate: () => apply(Math.cos(state.t) * 0.3, Math.sin(state.t) * 0.3),
      })
      return () => {
        tween.kill()
      }
    }

    const onMove = (event: PointerEvent) =>
      apply(event.clientX / window.innerWidth - 0.5, event.clientY / window.innerHeight - 0.5)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <h1
      ref={ref}
      className="relative font-display text-[clamp(6rem,21vw,19rem)] leading-[0.82] font-semibold tracking-[-0.08em] select-none"
    >
      <span
        aria-hidden="true"
        data-depth="0.05"
        className="absolute inset-0 text-transparent [-webkit-text-stroke:1.5px_rgb(90_59_255_/_0.75)]"
      >
        {code}
      </span>
      <span
        aria-hidden="true"
        data-depth="-0.035"
        className="absolute inset-0 text-transparent [-webkit-text-stroke:1.5px_rgb(34_208_252_/_0.6)]"
      >
        {code}
      </span>
      <span data-depth="0.015" className="text-gradient relative block">
        {code}
      </span>
    </h1>
  )
}
