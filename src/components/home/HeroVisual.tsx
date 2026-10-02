'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import heroImage from '@/assets/images/zynara-hero.jpg'
import { prefersReducedMotion } from '@/lib/env'

// three.js only loads in the browser, after the page is interactive.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

function supportsWebGL2() {
  try {
    const canvas = document.createElement('canvas')
    return !!canvas.getContext('webgl2')
  } catch {
    return false
  }
}

/** Interactive 3D city for the home hero, with a still-image fallback. */
export function HeroVisual({ alt }: { alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0, active: 0 })
  const [mode, setMode] = useState<'pending' | 'webgl' | 'fallback'>('pending')
  const [active, setActive] = useState(true)
  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(prefersReducedMotion())
    if (!supportsWebGL2()) {
      setMode('fallback')
      return
    }
    // Defer the 3D bundle until the browser is idle so text paints first.
    const start = () => setMode('webgl')
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1200 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(start, 300)
    return () => clearTimeout(id)
  }, [])

  // Pause rendering whenever the hero is off-screen or the tab is hidden.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let visible = true
    const update = () => setActive(visible && document.visibilityState === 'visible')
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', update)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  // Track the pointer across the whole hero (content sits above the canvas).
  useEffect(() => {
    const el = wrapRef.current?.parentElement
    if (!el) return
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
      pointer.current.active = event.pointerType === 'mouse' ? 1 : 0.6
    }
    const onLeave = () => {
      pointer.current.active = 0
      pointer.current.x *= 0.5
      pointer.current.y *= 0.5
    }
    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
      {/* Atmosphere shown while the scene loads */}
      <div
        className="absolute inset-0 transition-opacity duration-[1600ms]"
        style={{
          opacity: ready ? 0 : 1,
          background:
            'radial-gradient(60% 55% at 72% 62%, rgb(79 70 229 / 0.28), transparent 70%), radial-gradient(40% 40% at 88% 30%, rgb(34 195 255 / 0.14), transparent 70%)',
        }}
      />

      {mode === 'fallback' && (
        <Image
          src={heroImage}
          alt={alt}
          fill
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-[70%_center] opacity-80"
        />
      )}

      {mode === 'webgl' && (
        <div className="absolute inset-0 transition-opacity duration-[1800ms] ease-out" style={{ opacity: ready ? 1 : 0 }}>
          <HeroScene active={active} pointer={pointer} reducedMotion={reducedMotion} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  )
}
