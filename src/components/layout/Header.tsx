'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { company, nav } from '@/content/site'
import { Logo } from '@/components/brand/Logo'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { Button, RollText } from '@/components/ui/Button'

// Loaded on demand: keeps the menu (and Framer Motion) out of the initial bundle.
const MobileMenu = dynamic(() => import('./MobileMenu').then((mod) => mod.MobileMenu), { ssr: false })

type Theme = 'dark' | 'light'

/**
 * Fixed header. It reads the `data-theme` of whichever section sits beneath it
 * so the logo and links stay legible over both dark and light sections.
 */
export function Header() {
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const [theme, setTheme] = useState<Theme>('dark')
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuLoaded, setMenuLoaded] = useState(false)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    let lastY = window.scrollY
    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY
      setScrolled(y > 24)
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 160)
        lastY = y
      }
      const probeY = header.offsetHeight / 2
      const below = document
        .elementsFromPoint(window.innerWidth / 2, probeY)
        .find((el) => !header.contains(el) && el.closest('[data-theme]'))
      const next = (below?.closest<HTMLElement>('[data-theme]')?.dataset.theme as Theme) ?? 'dark'
      setTheme(next)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Re-read the theme once a new page has painted beneath the header.
  useEffect(() => {
    setMenuOpen(false)
    setHidden(false)
    const id = setTimeout(() => window.dispatchEvent(new Event('scroll')), 60)
    return () => clearTimeout(id)
  }, [pathname])

  const isLight = theme === 'light' && !menuOpen

  return (
    <>
      <header
        ref={headerRef}
        className="site-header"
        data-theme={isLight ? 'light' : 'dark'}
        data-scrolled={scrolled && !menuOpen}
        data-hidden={hidden && !menuOpen}
        data-menu={menuOpen}
      >
        <a
          href="#main"
          className="sr-only rounded-full bg-white px-4 py-2 text-sm text-ink focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <div className="shell flex h-16 items-center justify-between lg:h-20">
          <TransitionLink href="/" aria-label="Zynara Tech home" className="relative z-10">
            <Logo />
          </TransitionLink>

          <nav aria-label="Main navigation" className="hidden items-center gap-10 md:flex">
            <ul className="flex items-center gap-9 text-[0.92rem]">
              {nav.map((item) => {
                const active = pathname === item.href
                return (
                  <li key={item.href}>
                    <TransitionLink
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className="roll-trigger link-line"
                    >
                      <RollText>{item.label}</RollText>
                    </TransitionLink>
                  </li>
                )
              })}
            </ul>
            <Button href={company.vaqtoUrl} variant={isLight ? 'dark' : 'primary'} className="!h-11 !text-[0.88rem]">
              Visit Vaqto
            </Button>
          </nav>

          <button
            type="button"
            className="relative z-10 -mr-2 flex h-11 items-center gap-3 px-2 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onPointerDown={() => setMenuLoaded(true)}
            onFocus={() => setMenuLoaded(true)}
            onClick={() => {
              setMenuLoaded(true)
              setMenuOpen((open) => !open)
            }}
          >
            <span className="mono-label">{menuOpen ? 'Close' : 'Menu'}</span>
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-expo)] ${menuOpen ? 'top-1.5 rotate-45' : 'top-0.5'}`}
              />
              <span
                className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-expo)] ${menuOpen ? 'top-1.5 -rotate-45' : 'top-2.5'}`}
              />
            </span>
          </button>
        </div>
      </header>
      {menuLoaded && <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />}
    </>
  )
}
