'use client'

import { useState } from 'react'
import { Check, Copy } from '@/components/ui/icons'

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-11 items-center gap-2.5 rounded-full border border-ink/15 px-5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
    >
      {copied ? <Check className="size-4 text-cyan" /> : <Copy className="size-4" />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
    </button>
  )
}
