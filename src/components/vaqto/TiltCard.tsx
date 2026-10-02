'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '@/lib/gsap'
import { hasFinePointer, prefersReducedMotion } from '@/lib/env'

/** Gentle 3D tilt with a moving highlight, following the pointer. */
export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const glare = glareRef.current
    if (!el || !glare || !hasFinePointer() || prefersReducedMotion()) return

    gsap.set(el, { transformPerspective: 1400 })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.9, ease: 'power3' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.9, ease: 'power3' })

    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height
      ry((px - 0.5) * 9)
      rx((0.5 - py) * 7)
      gsap.to(glare, {
        opacity: 1,
        background: `radial-gradient(40% 40% at ${px * 100}% ${py * 100}%, rgb(255 255 255 / 0.22), transparent 70%)`,
        duration: 0.4,
      })
    }
    const leave = () => {
      rx(0)
      ry(0)
      gsap.to(glare, { opacity: 0, duration: 0.6 })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div ref={ref} className={`relative [transform-style:preserve-3d] will-change-transform ${className}`}>
      {children}
      <div ref={glareRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0" />
    </div>
  )
}
