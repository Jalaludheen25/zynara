'use client'

import { useEffect } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react'
import { company } from '@/content/site'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { ArrowUpRight } from '@/components/ui/icons'
import { setScrollLocked } from '@/lib/scroll'

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Vaqto', href: '/vaqto' },
  { label: 'Contact', href: '/contact' },
]

const ease = [0.19, 1, 0.22, 1] as const

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    setScrollLocked(true)
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      setScrollLocked(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-lenis-prevent
            className="fixed inset-0 z-[55] flex flex-col overflow-y-auto bg-ink text-white md:hidden"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(70% 40% at 100% 0%, rgb(79 70 229 / 0.28), transparent 70%), radial-gradient(60% 40% at 0% 100%, rgb(34 195 255 / 0.16), transparent 70%)',
              }}
            />
            <nav aria-label="Mobile navigation" className="shell relative flex flex-1 flex-col justify-center pt-24 pb-10">
              <ul className="flex flex-col gap-1">
                {links.map((link, index) => (
                  <li key={link.href} className="overflow-hidden">
                    <m.div
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '-110%', transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } }}
                      transition={{ delay: 0.25 + index * 0.07, duration: 1, ease }}
                    >
                      <TransitionLink
                        href={link.href}
                        onClick={onClose}
                        className="flex items-baseline gap-4 py-1 font-display text-[clamp(2.75rem,13vw,4.5rem)] leading-[1.05] font-medium tracking-[-0.05em]"
                      >
                        <span className="font-mono text-xs tracking-[0.2em] text-cyan">0{index + 1}</span>
                        {link.label}
                      </TransitionLink>
                    </m.div>
                  </li>
                ))}
              </ul>

              <m.div
                className="mt-auto flex flex-col gap-6 pt-14"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ delay: 0.55, duration: 0.9, ease }}
              >
                <a href={`mailto:${company.email}`} className="text-lg text-fog">
                  {company.email}
                </a>
                <a
                  href={company.vaqtoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center justify-between rounded-full bg-white px-6 font-medium text-ink"
                >
                  Visit Vaqto <ArrowUpRight className="size-4" />
                </a>
                <div className="flex gap-6 text-sm text-slate">
                  <TransitionLink href="/privacy" onClick={onClose}>
                    Privacy
                  </TransitionLink>
                  <TransitionLink href="/terms" onClick={onClose}>
                    Terms
                  </TransitionLink>
                  <span className="ml-auto">{company.locationFull}</span>
                </div>
              </m.div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}
