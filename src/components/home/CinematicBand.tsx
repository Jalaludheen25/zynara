'use client'

import { useRef } from 'react'
import Image from 'next/image'
import heroImage from '@/assets/images/zynara-hero.jpg'
import { gsap, useGSAP } from '@/lib/gsap'
import { motionDisabled } from '@/lib/env'

/** Full-bleed artwork that opens from a framed card to edge-to-edge as you scroll. */
export function CinematicBand({ alt }: { alt: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (motionDisabled()) return
      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (ctx) => {
        const inset = ctx.conditions?.desktop ? '12% 14% 12% 14%' : '6% 4% 6% 4%'
        gsap.fromTo(
          frameRef.current,
          { clipPath: `inset(${inset} round 28px)` },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', end: 'top 5%', scrub: true },
          },
        )
        gsap.fromTo(
          mediaRef.current,
          { scale: 1.3, yPercent: -6 },
          {
            scale: 1,
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} data-theme="dark" className="relative bg-ink">
      <div ref={frameRef} className="relative h-[62svh] overflow-hidden sm:h-[80svh] lg:h-[108svh]">
        <div ref={mediaRef} className="absolute inset-0 will-change-transform">
          <Image src={heroImage} alt={alt} fill sizes="100vw" placeholder="blur" className="object-cover object-[64%_center]" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--color-ink)_0%,transparent_22%,transparent_70%,var(--color-ink)_100%)]" />
      </div>
    </section>
  )
}
