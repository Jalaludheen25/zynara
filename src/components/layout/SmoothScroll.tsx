'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/env'
import { setLenis } from '@/lib/scroll'

/** Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    // Touch devices keep native momentum scrolling (syncTouch is off by default).
    const lenis = new Lenis({ lerp: 0.095, smoothWheel: true, wheelMultiplier: 1, autoRaf: false })
    setLenis(lenis)

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return null
}
