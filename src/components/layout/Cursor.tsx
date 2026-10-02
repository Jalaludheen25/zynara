'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from '@/lib/gsap'
import { hasFinePointer, prefersReducedMotion } from '@/lib/env'

type CursorState = 'default' | 'hover' | 'label'

/**
 * Desktop-only cursor: an exact dot plus a trailing ring that grows over
 * interactive elements. Elements with data-cursor-label="View" show a label.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (hasFinePointer() && !prefersReducedMotion()) setEnabled(true)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    if (!enabled || !root || !dot || !ring) return

    document.documentElement.classList.add('has-cursor')

    const dotX = gsap.quickSetter(dot, 'x', 'px')
    const dotY = gsap.quickSetter(dot, 'y', 'px')
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' })

    const setState = (state: CursorState) => {
      if (root.dataset.state !== state) root.dataset.state = state
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
      if (root.dataset.visible !== 'true' && root.dataset.suppressed !== 'true') root.dataset.visible = 'true'
    }

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (!target?.closest) return

      // Native caret is clearer over form fields.
      const field = target.closest('input, textarea, select, [contenteditable="true"]')
      root.dataset.suppressed = field ? 'true' : 'false'
      root.dataset.visible = field ? 'false' : 'true'

      const labelled = target.closest<HTMLElement>('[data-cursor-label]')
      if (labelled) {
        if (labelRef.current) labelRef.current.textContent = labelled.dataset.cursorLabel ?? ''
        setState('label')
      } else if (target.closest('a, button, [role="button"], label, summary, [data-cursor]')) {
        setState('hover')
      } else {
        setState('default')
      }
    }

    const onLeave = () => (root.dataset.visible = 'false')
    const onDown = () => gsap.to(ring, { scale: 0.82, duration: 0.25, ease: 'power3.out' })
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' })

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [enabled])

  // Whatever was under the cursor may be gone after a route change.
  useEffect(() => {
    if (rootRef.current) rootRef.current.dataset.state = 'default'
  }, [pathname])

  if (!enabled) return null

  return (
    <div ref={rootRef} className="cursor" data-state="default" data-visible="false" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  )
}
