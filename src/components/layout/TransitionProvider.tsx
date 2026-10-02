'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from '@/lib/gsap'
import { motionDisabled } from '@/lib/env'
import { announcePageEnter } from '@/lib/page-events'
import { scrollToTarget, setScrollLocked } from '@/lib/scroll'
import { LogoMark } from '@/components/brand/Logo'

type TransitionApi = { navigate: (href: string) => void }

const TransitionContext = createContext<TransitionApi>({ navigate: () => {} })

export const usePageTransition = () => useContext(TransitionContext)

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/vaqto': 'Vaqto',
  '/contact': 'Contact',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
}

type Phase = 'intro' | 'idle' | 'covering' | 'covered'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const curtainRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const phase = useRef<Phase>('intro')
  const pathRef = useRef(pathname)
  const isFirstPath = useRef(true)
  const safetyTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  pathRef.current = pathname

  /** Lifts the curtain off the current page and tells reveals to start. */
  const uncover = useCallback((key: string) => {
    const curtain = curtainRef.current
    if (!curtain) return
    clearTimeout(safetyTimer.current)
    gsap.killTweensOf([curtain, contentRef.current, barRef.current])

    gsap
      .timeline({
        onComplete: () => {
          gsap.set(curtain, { visibility: 'hidden', clipPath: 'inset(100% 0% 0% 0%)' })
          curtain.dataset.intro = 'false'
          curtain.dataset.active = 'false'
          phase.current = 'idle'
        },
      })
      .to(contentRef.current, { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: 'power3.in' })
      .to(curtain, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.05, ease: 'expo.inOut' }, '-=0.2')
      .add(() => {
        setScrollLocked(false)
        announcePageEnter(key)
      }, '-=0.72')
  }, [])

  // First load: the curtain is server-rendered over the page and doubles as a short intro.
  useEffect(() => {
    const curtain = curtainRef.current
    if (!curtain) return

    if (motionDisabled()) {
      phase.current = 'idle'
      curtain.dataset.intro = 'false'
      announcePageEnter(pathRef.current)
      return
    }

    let cancelled = false
    const fonts = document.fonts?.ready ?? Promise.resolve()
    Promise.race([fonts, wait(1400)]).then(() => {
      if (cancelled) return
      gsap
        .timeline({ onComplete: () => uncover(pathRef.current) })
        .fromTo(contentRef.current, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: 0.7 })
        .fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.inOut' }, '<0.1')
    })
    return () => {
      cancelled = true
    }
  }, [uncover])

  // A new route has rendered.
  useEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false
      return
    }
    if (phase.current === 'covered' || phase.current === 'covering') {
      scrollToTarget(0, true)
      // Give the new page a frame to paint beneath the curtain.
      requestAnimationFrame(() => requestAnimationFrame(() => uncover(pathname)))
    } else {
      // Browser back/forward — no curtain, reveal straight away.
      announcePageEnter(pathname)
    }
  }, [pathname, uncover])

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href)
      const target = url.pathname + url.search + url.hash

      if (url.origin !== window.location.origin) {
        window.location.assign(href)
        return
      }
      if (url.pathname === window.location.pathname) {
        scrollToTarget(url.hash || 0)
        return
      }
      if (phase.current !== 'idle') return
      if (motionDisabled()) {
        router.push(target)
        return
      }

      const curtain = curtainRef.current
      if (!curtain) {
        router.push(target)
        return
      }

      phase.current = 'covering'
      if (labelRef.current) labelRef.current.textContent = PAGE_LABELS[url.pathname] ?? ''
      curtain.dataset.active = 'true'
      setScrollLocked(true)

      gsap
        .timeline({
          onComplete: () => {
            phase.current = 'covered'
            // The old page is hidden now, so reset scroll before the new one mounts.
            scrollToTarget(0, true)
            router.push(target, { scroll: false })
            // Never leave the curtain down if navigation stalls.
            safetyTimer.current = setTimeout(() => uncover(pathRef.current), 8000)
          },
        })
        .set(curtain, { visibility: 'visible', clipPath: 'inset(100% 0% 0% 0%)' })
        .set(contentRef.current, { autoAlpha: 0, yPercent: 40 })
        .set(barRef.current, { scaleX: 0 })
        .to(curtain, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.inOut' })
        .to(contentRef.current, { autoAlpha: 1, yPercent: 0, duration: 0.6 }, '-=0.35')
        .to(barRef.current, { scaleX: 1, duration: 0.5, ease: 'expo.inOut' }, '<')
    },
    [router, uncover],
  )

  const api = useMemo(() => ({ navigate }), [navigate])

  return (
    <TransitionContext.Provider value={api}>
      {children}
      <div ref={curtainRef} className="page-curtain" data-intro="true" aria-hidden="true">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 110%, rgb(79 70 229 / 0.35), transparent 70%), radial-gradient(40% 35% at 80% 0%, rgb(34 195 255 / 0.12), transparent 70%)',
          }}
        />
        <div ref={contentRef} className="relative flex flex-col items-center gap-6">
          <LogoMark className="h-12 w-auto sm:h-14" />
          <span ref={labelRef} className="font-display text-2xl font-medium tracking-[-0.04em] text-white sm:text-3xl" />
          <span className="relative block h-px w-40 overflow-hidden bg-white/10">
            <span ref={barRef} className="bg-brand absolute inset-0 origin-left" />
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  )
}
