'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '@/lib/gsap'
import { hasFinePointer, prefersReducedMotion } from '@/lib/env'

type Props = { children: ReactNode; strength?: number; className?: string }

/** Pulls its child toward the cursor while hovered (desktop pointers only). */
export function Magnetic({ children, strength = 0.3, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !hasFinePointer() || prefersReducedMotion()) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.45)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.45)' })
    let rect = el.getBoundingClientRect()

    const enter = () => {
      gsap.set(el, { x: 0, y: 0 })
      rect = el.getBoundingClientRect()
    }
    const move = (event: PointerEvent) => {
      xTo((event.clientX - (rect.left + rect.width / 2)) * strength)
      yTo((event.clientY - (rect.top + rect.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(el)
    }
  }, [strength])

  return (
    <span ref={ref} className={`inline-flex will-change-transform ${className}`}>
      {children}
    </span>
  )
}
