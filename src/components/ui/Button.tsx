import type { ReactNode } from 'react'
import { TransitionLink } from './TransitionLink'
import { Magnetic } from './Magnetic'
import { ArrowRight, ArrowUpRight, ArrowDown } from './icons'

/** Text that rolls up to a duplicate of itself on hover. */
export function RollText({ children }: { children: ReactNode }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}

type Variant = 'primary' | 'ghost' | 'dark' | 'outline'

type ButtonProps = {
  href: string
  children: string
  variant?: Variant
  className?: string
  magnetic?: boolean
  /** Visual arrow; defaults to ↗ for external links, ↓ for anchors, → otherwise. */
  icon?: 'right' | 'external' | 'down'
}

export function Button({ href, children, variant = 'primary', className = '', magnetic = true, icon }: ButtonProps) {
  const isExternal = /^(https?:|mailto:)/.test(href)
  const iconKind = icon ?? (isExternal ? 'external' : href.startsWith('#') ? 'down' : 'right')
  const Icon = iconKind === 'external' ? ArrowUpRight : iconKind === 'down' ? ArrowDown : ArrowRight
  const classes = `btn btn-${variant} ${className}`

  const content = (
    <>
      <RollText>{children}</RollText>
      <span className="btn-icon" aria-hidden="true">
        <Icon />
      </span>
    </>
  )

  const link = isExternal ? (
    <a
      href={href}
      className={classes}
      data-external=""
      {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  ) : (
    <TransitionLink href={href} className={classes}>
      {content}
    </TransitionLink>
  )

  return magnetic ? <Magnetic>{link}</Magnetic> : link
}
