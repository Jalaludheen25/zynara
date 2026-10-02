'use client'

import { useEffect, useRef, useState } from 'react'
import { scrollToTarget } from '@/lib/scroll'

type Props = { items: { id: string; title: string }[] }

/** Sticky contents list with scroll-spy and a reading-progress rail. */
export function LegalToc({ items }: Props) {
  const [active, setActive] = useState(items[0]?.id)
  const progressRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[]
    const article = sections[0]?.parentElement
    let frame = 0

    const update = () => {
      frame = 0
      const marker = window.innerHeight * 0.35
      let current = items[0]?.id
      for (const section of sections) {
        if (section.getBoundingClientRect().top - marker <= 0) current = section.id
      }
      setActive(current)
      if (article && progressRef.current) {
        const rect = article.getBoundingClientRect()
        const progress = Math.min(1, Math.max(0, (marker - rect.top) / Math.max(rect.height - marker * 0.6, 1)))
        progressRef.current.style.transform = `scaleY(${progress})`
      }
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
  }, [items])

  return (
    <nav aria-label="On this page" className="relative pl-6">
      <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px bg-ink/10">
        <span ref={progressRef} className="bg-brand absolute inset-0 origin-top scale-y-0" />
      </span>
      <p className="mono-label text-muted">On this page</p>
      <ol className="mt-5 space-y-1">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault()
                scrollToTarget(`#${item.id}`)
              }}
              aria-current={active === item.id ? 'location' : undefined}
              className={`flex gap-3 py-1.5 text-[0.95rem] transition-colors duration-300 ${
                active === item.id ? 'text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              <span className="w-5 shrink-0 font-mono text-xs leading-6 text-indigo">0{i + 1}</span>
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
