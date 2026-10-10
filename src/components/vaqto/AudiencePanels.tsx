'use client'

import { useState } from 'react'

type Item = { label: string; title: string }

const GLOWS = [
  'radial-gradient(80% 70% at 20% 100%, rgb(78 40 252 / 0.55), transparent 70%)',
  'radial-gradient(80% 70% at 50% 100%, rgb(79 70 229 / 0.5), rgb(34 195 255 / 0.12) 60%, transparent 80%)',
  'radial-gradient(80% 70% at 80% 100%, rgb(34 195 255 / 0.45), transparent 70%)',
]

/** Three audience panels; the focused one widens on desktop. */
export function AudiencePanels({ items }: { items: readonly Item[] }) {
  const [active, setActive] = useState(0)

  return (
    <ul className="mt-16 flex flex-col gap-3 lg:mt-20 lg:h-[460px] lg:flex-row">
      {items.map((item, i) => {
        const isActive = active === i
        return (
          <li
            key={item.label}
            onMouseEnter={() => setActive(i)}
            data-cursor
            className="group relative isolate flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 bg-graphite/40 p-7 transition-[flex-grow,border-color] lg:basis-0 duration-[900ms] ease-[var(--ease-expo)] lg:min-h-0 lg:p-10"
            style={{ flexGrow: isActive ? 1.9 : 1 }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 transition-opacity duration-700"
              style={{ background: GLOWS[i], opacity: isActive ? 1 : 0.35 }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgb(255_255_255_/_0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255_/_0.05)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
            />
            <div className="flex items-center justify-between">
              <span className="mono-label text-glow">{item.label}</span>
              <span className="font-mono text-xs text-slate">0{i + 1}</span>
            </div>
            <h3
              className={`max-w-[18ch] font-display text-[clamp(1.35rem,1.9vw,1.9rem)] leading-[1.1] font-medium tracking-[-0.04em] text-white transition-[opacity,transform] duration-700 ease-[var(--ease-expo)] lg:max-w-[16ch] ${
                isActive ? 'lg:translate-y-0 lg:opacity-100' : 'lg:translate-y-3 lg:opacity-60'
              }`}
            >
              {item.title}
            </h3>
          </li>
        )
      })}
    </ul>
  )
}
