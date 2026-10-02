import { useId } from 'react'
import { MARK_PATH } from './mark-path'

type MarkProps = { className?: string; title?: string }

/** The Zynara "Z" route mark with the brand violet → cyan gradient. */
export function LogoMark({ className, title }: MarkProps) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      viewBox="0 0 974 624"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <defs>
        <linearGradient id={`zg-${id}`} x1="0" y1="624" x2="974" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4E28FC" />
          <stop offset="1" stopColor="#22D0FC" />
        </linearGradient>
      </defs>
      <path fill={`url(#zg-${id})`} d={MARK_PATH} />
    </svg>
  )
}

/** Mark + "Zynara Tech" wordmark lockup used in the header and footer. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-[22px] w-auto shrink-0" />
      <span className="font-display text-[1.06rem] font-semibold tracking-[-0.035em]">
        Zynara <span className="font-normal opacity-60">Tech</span>
      </span>
    </span>
  )
}
