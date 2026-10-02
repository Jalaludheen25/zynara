'use client'

import { scrollToTarget } from '@/lib/scroll'
import { ArrowRight } from '@/components/ui/icons'

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => scrollToTarget(0)}
      className="group inline-flex items-center gap-2 text-fog transition-colors hover:text-white"
    >
      Back to top
      <span className="grid size-7 place-items-center rounded-full border border-white/15 transition-colors group-hover:border-cyan">
        <ArrowRight className="size-3 -rotate-90" />
      </span>
    </button>
  )
}
