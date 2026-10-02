'use client'

import { useEffect, useState } from 'react'
import { company } from '@/content/site'

const format = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: company.timeZone,
  }).format(date)

/** Live local time in Dubai (GST). Renders a placeholder until mounted. */
export function LocalTime({ className = '' }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setTime(format(new Date()))
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className={`tabular-nums ${className}`}>
      <span className="mr-2 inline-block size-1.5 animate-pulse rounded-full bg-cyan align-middle" aria-hidden="true" />
      {time ?? '--:--'} GST
    </span>
  )
}
