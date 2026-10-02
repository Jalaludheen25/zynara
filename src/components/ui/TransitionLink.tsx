'use client'

import Link, { type LinkProps } from 'next/link'
import type { AnchorHTMLAttributes, ReactNode, Ref } from 'react'
import { usePageTransition } from '@/components/layout/TransitionProvider'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  Omit<LinkProps, 'href'> & {
    href: string
    children: ReactNode
    ref?: Ref<HTMLAnchorElement>
  }

/** next/link that plays the curtain transition before client-side navigation. */
export function TransitionLink({ href, children, onClick, ...rest }: Props) {
  const { navigate } = usePageTransition()

  // Same-page anchors (e.g. "#journey") scroll smoothly instead of navigating.
  if (href.startsWith('#')) {
    return (
      <a
        href={href}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented) return
          event.preventDefault()
          navigate(href)
        }}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      onNavigate={(event) => {
        event.preventDefault()
        navigate(href)
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}
