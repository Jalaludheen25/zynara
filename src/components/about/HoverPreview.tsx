'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { gsap } from '@/lib/gsap'
import { hasFinePointer, prefersReducedMotion } from '@/lib/env'
import { TransitionLink } from '@/components/ui/TransitionLink'

type Props = { href: string; image: StaticImageData; label: string; children: ReactNode }

/** A large text link that floats an image preview beside the cursor on hover. */
export function HoverPreview({ href, image, label, children }: Props) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const link = linkRef.current
    const preview = previewRef.current
    if (!link || !preview || !hasFinePointer() || prefersReducedMotion()) return

    const xTo = gsap.quickTo(preview, 'x', { duration: 0.7, ease: 'power3' })
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.7, ease: 'power3' })
    const rTo = gsap.quickTo(preview, 'rotate', { duration: 0.9, ease: 'power3' })
    let lastX = 0

    const enter = (event: PointerEvent) => {
      const rect = link.getBoundingClientRect()
      gsap.set(preview, { x: event.clientX - rect.left, y: event.clientY - rect.top })
      lastX = event.clientX
      gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'expo.out' })
    }
    const move = (event: PointerEvent) => {
      const rect = link.getBoundingClientRect()
      xTo(event.clientX - rect.left)
      yTo(event.clientY - rect.top)
      rTo(gsap.utils.clamp(-8, 8, (event.clientX - lastX) * 0.6))
      lastX = event.clientX
    }
    const leave = () => gsap.to(preview, { autoAlpha: 0, scale: 0.6, rotate: 0, duration: 0.5, ease: 'power3.out' })

    link.addEventListener('pointerenter', enter)
    link.addEventListener('pointermove', move)
    link.addEventListener('pointerleave', leave)
    return () => {
      link.removeEventListener('pointerenter', enter)
      link.removeEventListener('pointermove', move)
      link.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <TransitionLink ref={linkRef} href={href} aria-label={label} data-cursor-label="Open" className="group relative block">
      {children}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 z-10 -mt-[110px] -ml-[150px] hidden aspect-[4/3] w-[300px] scale-[0.6] overflow-hidden rounded-2xl opacity-0 shadow-2xl lg:block"
      >
        <Image src={image} alt="" fill sizes="300px" className="object-cover" />
      </div>
    </TransitionLink>
  )
}
