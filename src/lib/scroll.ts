'use client'

import type Lenis from 'lenis'

// The active Lenis instance (null when native scrolling is used).
let lenis: Lenis | null = null

export const setLenis = (instance: Lenis | null) => {
  lenis = instance
}

export const getLenis = () => lenis

export function scrollToTarget(target: string | number | HTMLElement, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, force: true, offset: 0, duration: 1.4 })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'instant' : 'smooth' })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth', block: 'start' })
}

export function setScrollLocked(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
