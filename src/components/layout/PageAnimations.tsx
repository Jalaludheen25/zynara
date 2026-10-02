'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap'
import { motionDisabled } from '@/lib/env'
import { onPageEnter } from '@/lib/page-events'

/*
  Declarative motion for server-rendered markup. Elements opt in with attributes:

  data-reveal="lines"        masked line-by-line text reveal
  data-reveal="chars"        masked character reveal
  data-reveal="words-scrub"  words brighten as the element scrolls through
  data-reveal="fade"         fade + rise
  data-reveal="stagger"      children fade + rise in sequence
  data-reveal="image"        clip-path wipe with the inner media settling in scale
  data-reveal="line"         hairline draws from the left
  data-reveal="scale-in"     soft scale + fade
  data-parallax="0.2"        scrubbed vertical drift (fraction of own height)

  Modifiers: data-delay="0.2" (seconds), data-intro (play when the page is
  uncovered rather than on scroll — used for hero content).
*/

const START = 'top 88%'

function buildReveal(el: HTMLElement): gsap.core.Animation | null {
  const type = el.dataset.reveal
  const delay = parseFloat(el.dataset.delay ?? '0') || 0

  switch (type) {
    case 'lines': {
      const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
      gsap.set(el, { visibility: 'visible' })
      return gsap.from(split.lines, {
        yPercent: 115,
        rotate: 1.5,
        transformOrigin: '0% 0%',
        duration: 1.45,
        stagger: 0.1,
        delay,
        paused: true,
        onComplete: () => split.revert(),
      })
    }
    case 'chars': {
      const split = SplitText.create(el, { type: 'chars', mask: 'chars', charsClass: 'split-char' })
      gsap.set(el, { visibility: 'visible' })
      return gsap.from(split.chars, {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.035,
        delay,
        paused: true,
        onComplete: () => split.revert(),
      })
    }
    case 'fade':
      return gsap.to(el, { opacity: 1, y: 0, duration: 1.4, delay, paused: true })
    case 'stagger':
      return gsap.to(el.children, {
        opacity: 1,
        y: 0,
        duration: 1.3,
        stagger: 0.09,
        delay,
        paused: true,
      })
    case 'image': {
      const inner = el.querySelector('img, video, [data-reveal-inner]')
      const scale = parseFloat(el.dataset.scale ?? '1.32')
      const tl = gsap.timeline({ paused: true, delay })
      tl.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' })
      if (inner && scale !== 1) tl.fromTo(inner, { scale }, { scale: 1, duration: 2.1, ease: 'expo.out' }, 0.15)
      return tl
    }
    case 'line':
      return gsap.to(el, { scaleX: 1, duration: 1.6, ease: 'expo.inOut', delay, paused: true })
    case 'scale-in':
      return gsap.to(el, { opacity: 1, scale: 1, duration: 1.6, delay, paused: true })
    default:
      return null
  }
}

function buildScrubs(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-reveal="words-scrub"]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', wordsClass: 'split-word' })
    gsap.fromTo(
      split.words,
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: 0.6 },
      },
    )
  })

  root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax ?? '0.15') * 100
    gsap.fromTo(
      el,
      { yPercent: -amount / 2 },
      {
        yPercent: amount / 2,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  })
}

export function PageAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.getElementById('page')
    if (!root) return

    let ctx: gsap.Context | undefined
    let disposeEnter = () => {}
    let cancelled = false

    const setup = () => {
      if (cancelled) return
      document.documentElement.classList.add('anim-ready')
      if (motionDisabled()) return

      const reveals: { el: HTMLElement; anim: gsap.core.Animation }[] = []

      ctx = gsap.context(() => {
        root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
          const anim = buildReveal(el)
          if (anim) reveals.push({ el, anim })
        })
        buildScrubs(root)
      }, root)

      disposeEnter = onPageEnter(pathname, () => {
        ctx?.add(() => {
          reveals.forEach(({ el, anim }) => {
            if (el.hasAttribute('data-intro')) {
              anim.play()
              return
            }
            ScrollTrigger.create({ trigger: el, start: START, once: true, onEnter: () => anim.play() })
          })
          ScrollTrigger.sort()
          ScrollTrigger.refresh()
        })
      })

      requestAnimationFrame(() => {
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
      })
    }

    const fonts = document.fonts?.ready ?? Promise.resolve()
    Promise.race([fonts, new Promise((resolve) => setTimeout(resolve, 1200))]).then(() =>
      requestAnimationFrame(setup),
    )

    return () => {
      cancelled = true
      disposeEnter()
      ctx?.revert()
    }
  }, [pathname])

  return null
}
